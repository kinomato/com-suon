import { Injectable } from '@angular/core';
import { FirebaseFirestore } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { CTNhapphutung } from '../models/ct-nhapphutung.model';
import { PhutungService } from './phutung.service';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class NhapphutungService {

  constructor(
    private fireStore: AngularFirestore,
    private phutungService: PhutungService) { }
  /* async Submit(data: any) {
    try {
      const docref = await this.fireStore.collection('nhapphutung').add(data);
      return docref.id;
    } catch (err) {
      console.log('submit nhập phụ tùng' + err);
      return '';
    }
  } */
  SubmitUlt(data: any, ctdata: CTNhapphutung[]) {
    const nptref = this.fireStore.firestore.collection('nhapphutung').doc();
    const idsc = nptref.id;
    const batch = this.fireStore.firestore.batch();
    batch.set(nptref, data);
    ctdata.forEach(ctnhapphutung => {
      const tempdata = Object.assign({}, ctnhapphutung);
      delete tempdata.idctnhappt;
      const ctref = this.fireStore.firestore.collection('nhapphutung/' + idsc + '/ctnhapphutung').doc();
      const ptref = this.fireStore.collection('phutung').doc(ctnhapphutung.phutung.idphutung).ref;
      const increment = firebase.firestore.FieldValue.increment(ctnhapphutung.soluong);
      batch.update(ptref, {soluongconlai: increment, phatsinh: increment});
      batch.set(ctref, tempdata);
    });
    return batch.commit();
  }
  /* ctSubmit(id: string, ctdata: CTNhapphutung[]) {
    ctdata.forEach(ctphutung => {
      const data = Object.assign({}, ctphutung);
      delete data.idctnhappt;
      this.fireStore.collection('nhapphutung/' + id + '/ctnhapphutung').add(data)
      .then(() => {
        const sl = data.phutung.soluongconlai + data.soluong;
        const newObj = Object.assign({}, data.phutung);
        newObj.soluongconlai = sl;
        this.phutungService.Update(newObj.idphutung, newObj);
      });
    });
  }
  Update(id: string, data: any ) {
    this.fireStore.collection('nhapphutung').doc(id).update(data);
  } */
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const scref = this.fireStore.collection('nhapphutung').doc(id).ref;
    const subcolref = this.fireStore.collection('nhapphutung' + id + 'ctnhapphutung').ref;
    const query = subcolref.orderBy('soluong');
    return query.get()
    .then(async snapshot => {
      batch.delete(scref);
      await snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const scref = this.fireStore.collection('nhapphutung').doc(id).ref;
    batch.update(scref, { isdelete: true });
    return batch.commit();
  }
  DeleteSub(id) {
    this.fireStore.collection('nhapphutung' + id + 'ctnhapphutung').snapshotChanges()
    .subscribe(actionArray => {
      actionArray.map(item => {
        this.fireStore.collection('nhapphutung' + id + 'ctnhapphutung').doc(item.payload.doc.id).delete()
        .catch(rejected => console.log(rejected));
      });
    },
    err => console.log('oh no' + err));
  }
  getNhapphutungs() {
    return this.fireStore.collection('nhapphutung'/* , ref => {
      return ref.where('isdelete', '==', false);
    } */).snapshotChanges();
  }
}
