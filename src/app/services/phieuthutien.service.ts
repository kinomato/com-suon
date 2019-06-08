import { Injectable } from '@angular/core';
import { PhieutiepnhanService } from 'src/app/services/phieutiepnhan.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { KhachhangService } from 'src/app/services/khachhang.service';
import { ToastrService } from 'ngx-toastr';
import { flatMap, map } from 'rxjs/operators';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';

@Injectable({
  providedIn: 'root'
})
export class PhieuthutienService {

  constructor(
    private tiepnhanService: PhieutiepnhanService,
    private fireStore: AngularFirestore,
    private khachhangService: KhachhangService,
    private toastr: ToastrService
  ) { }
  getPhieutiepnhans() {
    return this.tiepnhanService.getTiepnhanspt().pipe(
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
        return this.khachhangService.getKhachhang(res1.idkhachhang).pipe(
          map(res2 => {
            const datakhach = res2.data();
            return Object.assign(res1, datakhach);
          })
        );
      })
    );
  }
  SubmitUlt(datatt: any, datatn: any , tienthu: number ) {
    const ttref = this.fireStore.firestore.collection('thutien').doc();
    const batch = this.fireStore.firestore.batch();
    const tnref = this.fireStore.collection('tiepnhan').doc(datatn.idphieutiepnhan).ref;
    const newobj = {
      idthutien : ttref.id,
      thutienstt : true,
      tienno : datatn.tienno - tienthu
    };
    return tnref.get()
      .then(res => {
        const scref = this.fireStore.collection('suachua').doc(res.data().idsuachua).ref;
        batch.update(scref, { thutienstt: true });
        batch.set(ttref, datatt);
        batch.update(tnref, newobj);
        return batch.commit();
      });
  }
  Update(id: string, data: any) {
    return this.fireStore.collection('thutien').doc(id).update(data);
  }
  Delete(id: string) {
    /* this.DeleteSub(id); */
    const batch = this.fireStore.firestore.batch();
    const ttref = this.fireStore.collection('thutien').doc(id).ref;
    batch.update(ttref, { isdelete: true});
    return batch.commit();
    /* .then(() => {
      this.changeWhendeleted(id);
    }); */
  }
  DeleteUlt(id: string) {
    const batch = this.fireStore.firestore.batch();
    const ttref = this.fireStore.collection('thutien').doc(id).ref;
    return this.fireStore.collection('tiepnhan', ref => {
      return ref.limit(1).where('thutienid', '==', id);
    }).valueChanges()
    .pipe(
      map((result: Phieutiepnhan[]) => {
        const tnref = this.fireStore.collection('tiepnhan').doc(result[0].idphieutiepnhan).ref;
        batch.update(tnref, { thutienstt: false, thutienid: '' });
        return batch.commit();
      })
    );
  }
  getPhieuthutien(id: string) {
    return this.fireStore.collection('thutien').doc(id).valueChanges();
  }
  getPhieuthutiens() {
    return this.fireStore.collection('thutien', ref => {
      return ref.where('isdelete', '==', false);
    }).snapshotChanges();
  }
  getPhieuthutiensQuery(field: string, value: number) {
    return this.fireStore.collection('thutien'/* , ref => {
      return ref.where(field, '==', value);
    } */).snapshotChanges();
  }
  getPhieutiepnhan(bienso?: string) {
    return this.tiepnhanService.getTiepnhanQuery(bienso);
  }
  /* *** các function sau không còn được sử dụng *** */
  async Submit(data: any) {
    try {
      const docref = await this.fireStore.collection('thutien').add(data);
      return docref.id;
    } catch (err) {
      console.log('submit phieusuachua' + err);
      return '';
    }
  }
  changePhieutiepnhan(id: string, data: any, tienthu: number) {
    const newobj = Object.assign({} as Phieutiepnhan, data);
    delete newobj.tenkhachhang;
    delete newobj.diachi;
    delete newobj.dienthoai;
    newobj.idthutien = id;
    newobj.thutienstt = true;
    newobj.tienno = newobj.tienno - tienthu;
    if (newobj.tienno === 0) {
      newobj.tiennostt = false;
    }
    this.tiepnhanService.Update(data.idphieutiepnhan, newobj);
  }
}
