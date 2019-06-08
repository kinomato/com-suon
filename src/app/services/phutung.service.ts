import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Phutung } from 'src/app/models/phutung.model';

@Injectable({
  providedIn: 'root'
})
export class PhutungService {
  phutung: Phutung;

  constructor(private fireStore: AngularFirestore) { }

  Submit(data: Phutung) {
    return this.fireStore.collection('phutung').add(data);
  }
  Update(id: string, data: any ) {
    return this.fireStore.collection('phutung').doc(id).update(data);
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const ptref = this.fireStore.collection('phutung').doc(id).ref;
    batch.update(ptref, { isdelete: true });
    return batch.commit();
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const ptref = this.fireStore.collection('phutung').doc(id).ref;
    batch.delete(ptref);
    return batch.commit();
  }
  getPhutungs() {
    return this.fireStore.collection('phutung', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getPhutung(id: string) {
    return this.fireStore.doc('phutung/' + id).get();
  }
}
