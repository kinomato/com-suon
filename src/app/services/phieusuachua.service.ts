import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { CTPhieusuachua } from 'src/app/models/ct-phieusuachua.model';
import { forEach } from '@angular/router/src/utils/collection';
import { PhieutiepnhanService } from 'src/app/services/phieutiepnhan.service';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';
import { PhutungService } from './phutung.service';
import { reject } from 'q';
import * as firebase from 'firebase/app';
import { mergeMap, flatMap, map, switchMap } from 'rxjs/operators';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class PhieusuachuaService {

  constructor(
    private fireStore: AngularFirestore,
    private tiepnhanService: PhieutiepnhanService,
    private phutungService: PhutungService,
  ) { }

  async SubmitUlt(data: any, ctdata: CTPhieusuachua[], idtn: string) {
    const scref = this.fireStore.firestore.collection('suachua').doc();
    const tnref = this.fireStore.collection('tiepnhan').doc(idtn).ref;
    const idsc = scref.id;
    const batch = this.fireStore.firestore.batch();
    batch.set(scref, data);
    await ctdata.forEach(ctphieusuachua => {
      const tempdata = Object.assign({}, ctphieusuachua);
      delete tempdata.idctsuachua;
      const ctref = this.fireStore.firestore.collection('suachua/' + idsc + '/ctsuachua').doc();
      const ptref = this.fireStore.collection('phutung').doc(ctphieusuachua.phutung.idphutung).ref; // 3 dòng code
      const decrement = firebase.firestore.FieldValue.increment(-`${ctphieusuachua.soluong}`); // thay thế
      batch.update(ptref, {soluongconlai: decrement});                                        // function Subtransaction
      batch.set(ctref, tempdata);
    });
    const newobj = { suachuastt: true, tiennostt: true, tienno: data.tongtien, idsuachua: idsc };
    batch.update(tnref, newobj);
    return batch.commit();
  }
  async UpdateUtl(idsc: string, datasc: any, ctdata: CTPhieusuachua[], oldctdata: CTPhieusuachua[], deletelist: string[]) {
    const scref = this.fireStore.collection('suachua').doc(idsc).ref;
    const batch = this.fireStore.firestore.batch();
    batch.update(scref, datasc);
    await deletelist.forEach(idct => {
      const ctderef = this.fireStore.collection('suachua/' + idsc + '/ctsuachua').doc(idct).ref;
      batch.delete(ctderef);
    });
    await oldctdata.forEach(ctphieusuachua => {
      const ptref = this.fireStore.collection('phutung').doc(ctphieusuachua.phutung.idphutung).ref;
      const increment = firebase.firestore.FieldValue.increment(ctphieusuachua.soluong);
      batch.update(ptref, {soluongconlai: increment});
    });
    await ctdata.forEach(ctphieusuachua => {
      const datact = Object.assign({}, ctphieusuachua);
      delete datact.idctsuachua;
      const idct = ctphieusuachua.idctsuachua;
      const ptref = this.fireStore.collection('phutung').doc(ctphieusuachua.phutung.idphutung).ref;
      const decrement = firebase.firestore.FieldValue.increment(-ctphieusuachua.soluong);
      batch.update(ptref, {soluongconlai: decrement});
      if (idct === '' || idct === undefined || idct === null) {
        const ctref = this.fireStore.firestore.collection('suachua/' + idsc + '/ctsuachua').doc();
        batch.set(ctref, datact);
      } else {
        const ctref = this.fireStore.collection('suachua/' + idsc + '/ctsuachua').doc(idct).ref;
        batch.set(ctref, datact);
      }
    });
    return batch.commit();
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const scref = this.fireStore.collection('suachua').doc(id).ref;
    batch.update(scref, { isdelete: true});
    return batch.commit();
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const scref = this.fireStore.collection('suachua').doc(id).ref;
    const subcolref = this.fireStore.collection('suachua' + id + 'ctsuachua').ref;
    const query = subcolref.orderBy('soluong');
    return query.get()
    .then(async snapshot => {
      batch.delete(scref);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      const querytn = await this.tiepnhanService.getTiepnhanQuery2(id);
      querytn.pipe(
        map(res => {
          if (res.empty) {
            return batch.commit();
          } else {
            const snapshotquery = res.docs.pop();
            const tnref = this.fireStore.collection('tiepnhan').doc(snapshotquery.id).ref;
            const newobj = {suachuastt: false, tiennostt: false, idsuachua: '', tienno: 0};
            batch.update(tnref, newobj);
            return batch.commit();
          }
        })
      );
    });
  }
  subChangeWhenDeleted(id: string) {
    return this.tiepnhanService.getTiepnhanQuery2(id).pipe(
      map((res) => {
        if (res.empty) {
          return false;
        } else {
          const snapshot = res.docs.pop();
          const tnref = this.fireStore.collection('tiepnhan').doc(snapshot.id).ref;
          const newobj = {suachuastt: false, tiennostt: false, idsuachua: '', tienno: 0};
          return tnref.set(newobj);
        }
      })
    );
  }
  /* changeWhendeleted(id: string) {
    this.tiepnhanService.getTiepnhanQuery2(id).subscribe(actionArray => {
      return actionArray.map(item => {
        const idphieutiepnhan = item.payload.doc.id;
        const data = Object.assign({}, item.payload.doc.data());
        this.changePhieutiepnhanMinus(idphieutiepnhan, data);
      });
    });
  }
  changePhieutiepnhanMinus(idphieutiepnhan: string, data: any) {
    const newObj = Object.assign({}, data);
    delete newObj.idsuachua;
    delete newObj.tienno;
    newObj.suachuastt = false;
    newObj.tiennostt = false;
    newObj.idsuachua = '';
    newObj.tienno = 0;
    this.tiepnhanService.Update(idphieutiepnhan, newObj);
  } */
  getPhieusuachuas() {
    return this.fireStore.collection('suachua', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getPhieusuachua(id: string) {
    return this.fireStore.collection('suachua').doc(id).valueChanges();
  }
  getCTphieusuachuas(iddoc: string) {
    return this.fireStore.collection('suachua').doc(iddoc).collection('ctsuachua').snapshotChanges();
  }
  getCTphieusuachua(iddoc: string, idsubdoc: string) {
    return this.fireStore.doc('suachua/' + iddoc).collection('ctsuachua').doc(idsubdoc).valueChanges();
  }
  getPhieutiepnhan(bienso?: string) {
    return this.tiepnhanService.getTiepnhanQuery(bienso);
  }
  /* --- các function dưới đây không còn dùng --- */

  // --4 function dưới đây đã được cải thiện và gộp vào SubmitUlt--
  changePhieutiepnhan(id: string, data: Phieutiepnhan, tongtien: number) {
    const newObj = Object.assign({}, data);
    delete newObj.idphieutiepnhan;
    newObj.suachuastt = true;
    newObj.tiennostt = true;
    newObj.tienno = tongtien;
    newObj.idsuachua = id;
    this.tiepnhanService.Update(data.idphieutiepnhan, newObj);
  }
  async Submit(data: any) {
    try {
      const docref = await this.fireStore.collection('suachua').add(data);
      return docref.id;
    } catch (err) {
      console.log('submit phieusuachua' + err);
      return '';
    }
  }
  ctSubmit(id: string, ctdata: CTPhieusuachua[]) {
    ctdata.forEach(ctphieusuachua => {
      const data = Object.assign({}, ctphieusuachua);
      delete data.idctsuachua;
      this.fireStore.collection('suachua/' + id + '/ctsuachua').add(data)
        .then(() => {
          const sl = data.phutung.soluongconlai - data.soluong;
          const newObj = Object.assign({}, data.phutung);
          newObj.soluongconlai = sl;
          this.phutungService.Update(newObj.idphutung, newObj);
        });
    });
  }
  subTransaction(ctdata: CTPhieusuachua[]) {
    return ctdata.forEach(item => {
      const ptref = this.fireStore.collection('phutung').doc(item.phutung.idphutung).ref;
      return this.fireStore.firestore.runTransaction(transaction => {
        return transaction.get(ptref)
          .then(res => {
            const sl = res.data().soluongconlai - item.soluong;
            const newobj = { soluongconlai: sl };
            transaction.set(ptref, newobj, {merge: true});
          });
      });
    });
  }
  // --2 function dưới đây đã được cải thiện và gộp vào UpdateUlt--
  Update(id: string, data: any) {
    this.fireStore.collection('suachua').doc(id).update(data);
  }
  ctUpdate(id: string, ctdata: CTPhieusuachua[], deletelist: string[]) {
    deletelist.forEach(idct => {
      this.fireStore.collection('suachua/' + id + '/ctsuachua').doc(idct).delete();
    });
    ctdata.forEach(ctphieusuachua => {
      const data = Object.assign({}, ctphieusuachua);
      const idct = ctphieusuachua.idctsuachua;
      delete data.idctsuachua;
      if (idct === '' || idct === undefined || idct === null) {
        this.fireStore.collection('suachua/' + id + '/ctsuachua').add(data);
      } else {
        this.fireStore.collection('suachua/' + id + '/ctsuachua').doc(idct).update(data);
      }
    });
  }
  // --2 function dưới đây đã được cải thiện và gộp vào DeleteUlt--
  /* Delete(id: string) {
    this.DeleteSub(id);
    this.fireStore.collection('suachua').doc(id).delete()
      .then(() => {
        this.changeWhendeleted(id);
      });
  } */
  ctDelete(id: string, idct: string) {
    this.fireStore.collection('suachua/' + id + '/ctsuachua').doc(idct).delete();
  }
  // delete subcollection ctsuachua trong document
  DeleteSub(id) {
    this.fireStore.collection('suachua' + id + 'ctsuachua').snapshotChanges()
      .subscribe(actionArray => {
        actionArray.map(item => {
          this.fireStore.collection('suachua' + id + 'ctsuachua').doc(item.payload.doc.id).delete()
            .catch(rejected => console.log(rejected));
        });
      },
        err => console.log('oh no' + err));
  }
}
