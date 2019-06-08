import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Thamso } from 'src/app/models/thamso.model';

@Injectable({
  providedIn: 'root'
})
export class ThamsoService {
  thamso: Thamso;

  constructor(private fireStore: AngularFirestore) { }
  Submit(data: Thamso) {
    this.fireStore.collection('thamso').add(data);
  }
  Update(id: string, data: NgForm ) {
    this.fireStore.collection('thamso').doc(id).update(data);
  }
  Delete(id: string) {
    this.fireStore.collection('thamso').doc(id).delete();
  }
  getThamsos() {
    return this.fireStore.collection('thamso').snapshotChanges();
  }
  getThamso(id: string) {
    return this.fireStore.doc('thamso/' + id).get();
  }
}
