import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Phieutiepnhan } from '../models/phieutiepnhan.model';
import { mergeMap, flatMap, map, switchMap } from 'rxjs/operators';
import { observable, forkJoin, Observable, combineLatest, of } from 'rxjs';
import { Phieufilter } from '../interfaces/phieufilter';
import { Phieusuachua } from '../models/phieusuachua.model';
import { Phieuthutien } from '../models/phieuthutien.model';
import { Phutung } from '../models/phutung.model';
import { Tiencong } from '../models/tiencong.model';
import { Khachhang } from '../models/khachhang.model';
import { Hieuxe } from '../models/hieuxe.model';

@Injectable({
  providedIn: 'root'
})
export class RecycleService {

  constructor(private fireStore: AngularFirestore) { }
  getPhieutiepnhan() {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Phieutiepnhan, item.payload.doc.data());
              return {
                idphieu: item.payload.doc.id,
                path: '/phieutiepnhan/detail/',
                bienso: data.bienso,
                ngay: data.ngaytiepnhan,
                collection: 'tiepnhan',
                type: { tiepnhan: true, thutien: false, suachua: false, phutung: false, tiencong: false, khachhang: false, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getPhieusuachua() {
    return this.fireStore.collection('suachua', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Phieusuachua, item.payload.doc.data());
              return {
                idphieu: item.payload.doc.id,
                path: '/suachua/detail/',
                bienso: data.bienso,
                ngay: data.ngaysuachua,
                collection: 'suachua',
                type: { tiepnhan: false, thutien: false, suachua: true, phutung: false, tiencong: false, khachhang: false, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getPhieuthutien() {
    return this.fireStore.collection('thutien', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Phieuthutien, item.payload.doc.data());
              return {
                bienso: data.bienso,
                idphieu: item.payload.doc.id,
                path: '/thutien/detail/',
                ngay: data.ngaythutien,
                collection: 'thutien',
                type: { tiepnhan: false, thutien: true, suachua: false, phutung: false, tiencong: false, khachhang: false, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getPhutung() {
    return this.fireStore.collection('phutung', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Phutung, item.payload.doc.data());
              return {
                bienso: data.tenphutung,
                idphieu: item.payload.doc.id,
                path: '/phutung/detail/',
                tien: data.giaphutung,
                collection: 'phutung',
                type: { tiepnhan: false, thutien: false, suachua: false, phutung: true, tiencong: false, khachhang: false, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getTiencong() {
    return this.fireStore.collection('tiencong', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Tiencong, item.payload.doc.data());
              return {
                bienso: data.tenloaitiencong,
                idphieu: item.payload.doc.id,
                path: '/tiencong/detail/',
                tien: data.muctiencong,
                collection: 'tiencong',
                type: { tiepnhan: false, thutien: false, suachua: false, phutung: false, tiencong: true, khachhang: false, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getKhachhang() {
    return this.fireStore.collection('khachhang', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Khachhang, item.payload.doc.data());
              return {
                bienso: data.tenkhachhang,
                idphieu: item.payload.doc.id,
                path: '/khachhang/detail/',
                collection: 'khachhang',
                type: { tiepnhan: false, thutien: false, suachua: false, phutung: false, tiencong: false, khachhang: true, hieuxe: false }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  getHieuxe() {
    return this.fireStore.collection('hieuxe', ref => {
      return ref.where('isdelete', '==', true);
    }).snapshotChanges()
      .pipe(
        map(res => {
          if (res.length !== 0) {
            return res.map(item => {
              const data = Object.assign({} as Hieuxe, item.payload.doc.data());
              return {
                bienso: data.hieuxe,
                idphieu: item.payload.doc.id,
                path: '/hieuxe/detail/',
                collection: 'hieuxe',
                type: { tiepnhan: false, thutien: false, suachua: false, phutung: false, tiencong: false, khachhang: false, hieuxe: true }
              } as Phieufilter;
            });
          } else {
            return [];
          }
        })
      );
  }
  Restore(phieu: Phieufilter) {
    const batch = this.fireStore.firestore.batch();
    const pref = this.fireStore.collection(phieu.collection).doc(phieu.idphieu).ref;
    batch.update(pref, { isdelete: false });
    return batch.commit();
  }
  RestoreAll(arr: Phieufilter[]) {
    const batch = this.fireStore.firestore.batch();
    arr.forEach(phieu => {
      const pref = this.fireStore.collection(phieu.collection).doc(phieu.idphieu).ref;
      batch.update(pref, { isdelete: false });
    });
    return batch.commit();
  }
}
