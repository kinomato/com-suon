import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Khachhang } from 'src/app/models/khachhang.model';
import { isNgTemplate } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class KhachhangService {
  khachhang: Khachhang;

  constructor(private fireStore: AngularFirestore) { }
  Submit(data: Khachhang) {
    return this.fireStore.collection('khachhang').add(data);
  }
  submitAndReturnId(data: Khachhang) {
    return this.fireStore.collection('khachhang').add(data)
   .then(docref => {
     return docref.id;
   })
   .catch(err => {
     console.log('Oh no you suck again' + err);
     return '';
   });
 }
  Update(id: string, data: NgForm) {
    return this.fireStore.collection('khachhang').doc(id).update(data);
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const khref = this.fireStore.collection('khachhang').doc(id).ref;
    batch.update(khref, { isdelete: true });
    return batch.commit();
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const khref = this.fireStore.collection('khachhang').doc(id).ref;
    batch.delete(khref);
    return batch.commit();
  }
  getKhachhangs() {
    return this.fireStore.collection('khachhang', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getKhachhang(id: string) {
    return this.fireStore.doc('khachhang/' + id).get();
  }
  Find(data: Khachhang) {
    return  this.fireStore.collection('khachhang', ref => {
      return ref.limit(1).where('tenkhachhang', '==', data.tenkhachhang)
        .where('dienthoai', '==', data.dienthoai);
    }).get();
  }
}
