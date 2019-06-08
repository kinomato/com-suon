import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, flatMap, map, switchMap } from 'rxjs/operators';
import { observable, forkJoin, Observable, combineLatest, of } from 'rxjs';
import { Phieutiepnhan } from '../models/phieutiepnhan.model';
import { Phieufilter } from '../interfaces/phieufilter';
import { Phieusuachua } from '../models/phieusuachua.model';
import { Phieuthutien } from '../models/phieuthutien.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  currentdate = new Date();
  thang = this.currentdate.getMonth() + 1;

  constructor(private fireStore: AngularFirestore) { }

  getPhieutiepnhan(ngay: any, usemonth: boolean) {
    return this.fireStore.collection('tiepnhan', ref => {
      return (ngay === true) ? ref.where('ngaytiepnhan.month', '==', this.thang) : ref.where('ngaytiepnhan.day', '==', ngay);
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
                type: { tiepnhan: true, thutien: false, suachua: false }
              } as Phieufilter;
            });
          } else {
            console.log('tiepnhan failed');
            return [];
          }
        })
      );
  }
  getPhieusuachua(ngay: any, usemonth: boolean) {
    return this.fireStore.collection('suachua', ref => {
      return (ngay === true) ? ref.where('ngaysuachua.month', '==', this.thang) : ref.where('ngaysuachua.day', '==', ngay);
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
                type: { tiepnhan: false, thutien: false, suachua: true }
              } as Phieufilter;
            });
          } else {
            console.log('suachua failed');
            return [];
          }
        })
      );
  }
  getPhieuthutien(ngay: any, usemonth: boolean) {
    return this.fireStore.collection('thutien', ref => {
      return (ngay === true) ? ref.where('ngaythutien.month', '==', this.thang) : ref.where('ngaythutien.day', '==', ngay);
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
                type: { tiepnhan: false, thutien: true, suachua: false }
              } as Phieufilter;
            });
          } else {
            console.log('thutien failed');
            return [];
          }
        })
      );
  }
}
