import { Injectable } from '@angular/core';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';
import { Hieuxe } from 'src/app/models/hieuxe.model';
import { Khachhang } from 'src/app/models/khachhang.model';
import { Xesua } from 'src/app/models/xesua.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { HieuxeService } from 'src/app/services/hieuxe.service';
import { KhachhangService } from 'src/app/services/khachhang.service';
import { mergeMap, flatMap, map, switchMap, debounceTime, take } from 'rxjs/operators';
import { observable, forkJoin, Observable, combineLatest, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Xe } from '../interfaces/xe';

@Injectable({
  providedIn: 'root'
})
export class PhieutiepnhanService {
  phieutiepnhan: Phieutiepnhan;
  hieuxe: Hieuxe;
  khachhang: Khachhang;
  xesua: Xesua;
  anyList: Observable<Phieutiepnhan[]>;
  phieuList: Phieutiepnhan[];
  constructor(
    private fireStore: AngularFirestore,
    private hieuxeService: HieuxeService,
    private khachhangService: KhachhangService,
    private toastr: ToastrService
  ) { }
  Submit(dataform: any) {
    const data = Object.assign({}, dataform.value);
    const datakhachhang = Object.assign({}, dataform.value);
    delete datakhachhang.bienso;
    delete datakhachhang.hieuxe;
    delete datakhachhang.ngaytiepnhan;
    /* const query = await this.khachhangService.Find(datakhachhang); */
    return this.khachhangService.Find(datakhachhang).pipe(
      map(res => {
        if (res.empty) { // kiểm tra xem queries xong có trả về kết quả nào không
          const batch = this.fireStore.firestore.batch();
          const khref = this.fireStore.firestore.collection('khachhang').doc();
          const tnref = this.fireStore.firestore.collection('tiepnhan').doc();
          const xeref = this.fireStore.firestore.collection('xe').doc(data.bienso);
          const datatiepnhan = Object.assign({}, {
            bienso: data.bienso,
            ngaytiepnhan: data.ngaytiepnhan,
            hieuxe: data.hieuxe,
            idkhachhang: khref.id,
            /* tenkhachhang: data.tenkhachhang,
            dienthoai: data.dienthoai,
            diachi: data.diachi, */
            suachuastt: false,
            tiennostt: false,
            thutienstt: false,
            isdelete: false,
            idsuachua: '',
            tienno: 0,
            idthutien: ''
          });
          batch.set(khref, datakhachhang);
          batch.set(tnref, datatiepnhan);
          batch.set(xeref, {bienso: data.bienso, hieuxe: data.hieuxe});
          return batch.commit();
            /* .then(() => {
              this.toastr.success('Thêm thành công', 'Tiếp nhận xe');
              return true;
            },
              (reject) => {
                this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
                return false;
              })
            .catch(err => {
              this.toastr.error(err, 'Đã xảy ra lỗi');
              return false;
            }); */
        } else {
          const snapshot = res.docs.pop();
          const datatiepnhan = Object.assign({}, {
            bienso: data.bienso,
            ngaytiepnhan: data.ngaytiepnhan,
            hieuxe: data.hieuxe,
            idkhachhang: snapshot.id,
            /* tenkhachhang: data.tenkhachhang,
            dienthoai: data.dienthoai,
            diachi: data.diachi, */
            suachuastt: false,
            tiennostt: false,
            thutienstt: false,
            isdelete: false,
            idsuachua: '',
            tienno: 0,
            idthutien: ''
          });
          const batch = this.fireStore.firestore.batch();
          const xeref = this.fireStore.firestore.collection('xe').doc(data.bienso);
          const tnref = this.fireStore.firestore.collection('tiepnhan').doc();
          batch.set(tnref, datatiepnhan);
          batch.set(xeref, {bienso: data.bienso, hieuxe: data.hieuxe});
          return batch.commit();
          /* return this.fireStore.collection('tiepnhan').add(datatiepnhan)
            .then(() => {
              this.toastr.success('Thêm thành công', 'Tiếp nhận xe');
              return true;
            },
              (reject) => {
                this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
                return false;
              })
            .catch(err => {
              this.toastr.error(err, 'Đã xảy ra lỗi');
              return false;
            }); */
        }
      }));
  }
  Update(id: string, data: any) {
    /* console.log(id);
    console.log(data); */
    this.fireStore.collection('tiepnhan').doc(id).update(data)
      .then(() => {
        this.toastr.success('Cập nhật thành công', 'Cập nhật phiếu nhập');
      })
      .catch(err => {
        this.toastr.error('Cập nhật thất bại', err);
      });
  }
  UpdateTNandKhach(idtn: string, datatn: any, idkh: string, datakh: any) {
    const batch = this.fireStore.firestore.batch();
    const tnref = this.fireStore.collection('tiepnhan').doc(idtn).ref;
    const khref = this.fireStore.collection('khachhang').doc(idkh).ref;
    const xeref = this.fireStore.collection('xe').doc(datatn.bienso).ref;
    batch.set(xeref, {bienso: datatn.bienso, hieuxe: datatn.hieuxe}, {merge: true});
    batch.update(tnref, datatn);
    batch.update(khref, datakh);
    return batch.commit();
  }
  Delete(id: string) {
    const batch = this.fireStore.firestore.batch();
    const tnref = this.fireStore.collection('tiepnhan').doc(id).ref;
    batch.update(tnref, { isdelete: true });
    return batch.commit();
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const tnref = this.fireStore.collection('tiepnhan').doc(id).ref;
    batch.delete(tnref);
    return batch.commit();
  }
  getTiepnhans() {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getTiepnhansps() {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.where('suachuastt', '==', false);
    }).snapshotChanges();
  }
  getTiepnhanspt() {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.where('suachuastt', '==', true)
        /* .orderBy('suachuastt')
                  .startAt(true).endAt(true) */
        .where('thutienstt', '==', false);
    }).snapshotChanges();
  }
  getTiepnhan(id: string) {
    return this.fireStore.doc('tiepnhan/' + id).valueChanges();
  }
  getTiepnhanQuery(bienso?: string) {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.limit(1).where('bienso', '==', bienso);
      /* .where('hieuxe', '==', hieuxe)
      .where('idkhachhang', '==', idkhachhang); */
    }).snapshotChanges();
  }
  getTiepnhanQuery2(idsuachua: string) {
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.limit(1).where('idsuachua', '==', idsuachua);
    }).get();
  }
  getThongtin(id: string) {
    return this.getTiepnhan(id).pipe(
      flatMap((res: Phieutiepnhan) => {
        return this.khachhangService.getKhachhang(res.idkhachhang).pipe(
          map(res2 => {
            const datakhach = res2.data();
            return Object.assign(res, datakhach);
          })
        );
      })
    );
  }
  getThongtins() {
    return this.getTiepnhans().pipe(
      flatMap(res => {
        return res.map(item => {
          /* console.log(item.payload.doc.data()); */
          return {
            idphieutiepnhan: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Phieutiepnhan;
        });
      }),
      flatMap(res1 => {
        /* console.log(res1); */
        return this.khachhangService.getKhachhang(res1.idkhachhang).pipe(
          map(res2 => {
            const datakhach = res2.data();
            return Object.assign(res1, datakhach);
          })
        );
      })
    );
  }
  getThongtinsUlt() {
    return this.getTiepnhans()
      .pipe(
        map(res => {
          return res.map(item => {
            const data = { idphieutiepnhan: item.payload.doc.id, ...item.payload.doc.data() } as Phieutiepnhan;
            return this.khachhangService.getKhachhang(data.idkhachhang)
              .pipe(
                map(res1 => {
                  return { ...data, ...res1 } as Phieutiepnhan;
                })
              );
          });
        }),
        flatMap(tiepnhans => combineLatest(tiepnhans))
      );
  }
  Search(bienso: string) {
    return this.fireStore.collection('xe').doc(bienso).valueChanges()
    .pipe(
      debounceTime(500),
      take(1),
      map((res: Xe) => {
        return res;
      })
    );
  }
}
