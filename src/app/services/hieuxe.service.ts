import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hieuxe } from 'src/app/models/hieuxe.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CustomResObjectList } from 'src/app/interfaces/custom-res-object-list';
import { combineLatest, Subscription } from 'rxjs';
import { Phieufilter } from '../interfaces/phieufilter';
import { map, debounceTime, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HieuxeService {
  hieuxe: Hieuxe;
  constructor(
    private fireStore: AngularFirestore,
    private http: HttpClient,
    ) { }
  private path = 'https://firestore.googleapis.com/v1beta1/projects/cloud-firestore-test-f68a5/databases/(default)/documents/hieuxe/';
  Submit(data: Hieuxe) {
    return this.fireStore.collection('hieuxe').add(data);
  }
  Update(id: string, oldhieuxe: string, data: Hieuxe ) {
    const batch = this.fireStore.firestore.batch();
    const tenhieuxe = data.hieuxe;
    const tiepnhan$ = this.getPhieutiepnhan(oldhieuxe);
    const thutien$ = this.getPhieuthutien(oldhieuxe);
    const xe$ = this.getXe(oldhieuxe);
    console.log('hello');
    return combineLatest(tiepnhan$, thutien$, xe$)
    .pipe(
      map(res => {
        console.log(res);
        return [...res[0], ...res[1], ...res[2]] as Phieufilter[];
      }),
      map(async res1 => {
        const loop = await res1.forEach(phieu => {
          console.log(phieu.collection + phieu.idphieu);
          const pref = this.fireStore.collection(phieu.collection).doc(phieu.idphieu).ref;
          batch.set(pref, { hieuxe: tenhieuxe }, {merge: true});
        });
        console.log('oh no');
        const xeref = this.fireStore.collection('hieuxe').doc(id).ref;
        batch.update(xeref, { hieuxe: tenhieuxe });
        return batch.commit();
      })
    );
  }
  getXe(hieuxe: string) {
    return this.fireStore.collection('xe', ref => {
      return ref.where('hieuxe', '==', hieuxe);
    }).snapshotChanges()
    .pipe(
      map(res => {
        if (res.length !== 0) {
          return res.map(item => {
            return {
              idphieu: item.payload.doc.id,
              collection: 'xe'
            } as Phieufilter;
          });
        } else {
          return [];
        }
      })
    );
  }
  getPhieutiepnhan(hieuxe: string) {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.where('hieuxe', '==', hieuxe);
    }).snapshotChanges()
    .pipe(
      map(res => {
        if (res.length !== 0) {
          return res.map(item => {
            return {
              idphieu: item.payload.doc.id,
              collection: 'tiepnhan'
            } as Phieufilter;
          });
        } else {
          return [];
        }
      })
    );
  }
  getPhieuthutien(hieuxe: string) {
    return this.fireStore.collection('thutien', ref => {
      return ref.where('hieuxe', '==', hieuxe);
    }).snapshotChanges()
    .pipe(
      map(res => {
        if (res.length !== 0) {
          return res.map(item => {
            return {
              idphieu: item.payload.doc.id,
              collection: 'thutien'
            } as Phieufilter;
          });
        } else {
          return [];
        }
      })
    );
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const khref = this.fireStore.collection('hieuxe').doc(id).ref;
    batch.update(khref, { isdelete: true });
    return batch.commit();
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const khref = this.fireStore.collection('hieuxe').doc(id).ref;
    batch.delete(khref);
    return batch.commit();
  }
  getHieuXes() {
    return this.fireStore.collection('hieuxe', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  /* getHieuxes() {
    return this.http.get<CustomResObjectList>(this.path);
  } */
  getHieuxe(id: string) {
    return this.fireStore.doc('hieuxe/' + id).get();
  }
  Search(hieuxe: string) {
    return this.fireStore.collection('hieuxe', ref => {
      return ref.limit(1).where('hieuxe', '==', hieuxe);
    }).get()
    .pipe(
      debounceTime(500),
      take(1),
      map(res => {
        if (res.empty) {
          return;
        } else {
          const snapshot = res.docs.pop();
          return {
            idhieuxe: snapshot.id,
            ...snapshot.data()
          } as Hieuxe;
        }
      })
    );
  }
}
