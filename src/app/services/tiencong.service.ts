import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Tiencong } from 'src/app/models/tiencong.model';

@Injectable({
  providedIn: 'root'
})
export class TiencongService {
  tiencongList: Tiencong[];

  constructor(private fireStore: AngularFirestore) { }
  Submit(data: any) {
    return this.fireStore.collection('tiencong').add(data);
  }
  Update(id: string, data: NgForm ) {
    return this.fireStore.collection('tiencong').doc(id).update(data);
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const tcref = this.fireStore.collection('tiencong').doc(id).ref;
    batch.update(tcref, { isdelete: true });
    return batch.commit();
  }
  DeleteUlt(id: string) {
    return this.fireStore.collection('tiencong').doc(id).delete();
  }
  getTiencongs() {
    return this.fireStore.collection('tiencong', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getTiencong(id: string) {
    return this.fireStore.doc('tiencong/' + id).get();
  }
}
