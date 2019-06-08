import { Component, OnInit } from '@angular/core';
import { PhieutiepnhanService } from '../../services/phieutiepnhan.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';
import { Hieuxe } from 'src/app/models/hieuxe.model';
import { NgForm } from '@angular/forms';
import { HieuxeService } from 'src/app/services/hieuxe.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { KhachhangService } from 'src/app/services/khachhang.service';
import { ToastrService } from 'ngx-toastr';
import { Xe } from 'src/app/interfaces/xe';

@Component({
  selector: 'app-phieutiepnhan-detail',
  templateUrl: './phieutiepnhan-detail.component.html',
  styleUrls: ['./phieutiepnhan-detail.component.css']
})
export class PhieutiepnhanDetailComponent implements OnInit {
  phieutiepnhan: any;
  hieuxeList: Hieuxe[];
  hieuxeFilter: any;
  filteredOptions: any;
  model;
  isshow = true;
  subshieuxe: Subscription;
  substiepnhan: Subscription;
  xe: Xe;
  isshow1 = false;
  isshow2 = false;
  constructor(
    private tiepnhanService: PhieutiepnhanService,
    private location: Location,
    private activetedRoute: ActivatedRoute,
    private hieuxeService: HieuxeService,
    private fireStore: AngularFirestore,
    private khachhangService: KhachhangService,
    private toarst: ToastrService,
  ) { }
  ngOnInit() {
    this.formReset();
    this.getHieuxes();
    this.getThongtin();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subshieuxe.unsubscribe();
    this.substiepnhan.unsubscribe();
  }
  formReset() {
    this.phieutiepnhan = {
      tenkhachhang: '',
      hieuxe: '',
      bienso: '',
      diachi: '',
      dienthoai: ''
    };
  }
  search() {
    /* this.hieuxeFilter = this.hieuxeList.filter(hieuxe => {
      hieuxe.hieuxe.toLowerCase().includes(this.phieutiepnhan.hieuxe);
    }) */
    this.filteredOptions = this.fireStore.collection('tiepnhan', ref => ref
      .orderBy('tenkhachhang')
      .startAt(this.phieutiepnhan.hieuxe.toLowerCase())
      .endAt(this.phieutiepnhan.hieuxe.toLowerCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }
  getThongtin() {
    const id = this.activetedRoute.snapshot.paramMap.get('id');
    this.substiepnhan = this.tiepnhanService.getThongtin(id).subscribe(
      result => {
        /* console.log(result); */
        this.phieutiepnhan = Object.assign({}, result);
        /* console.log(this.phieutiepnhan.ngaytiepnhan); */
        this.model = Object.assign({}, this.phieutiepnhan.ngaytiepnhan);
        /* console.log(this.model); */
      },
      err => console.log(err));
  }
  onSave(form: NgForm) {
    this.isshow = false;
    /* const id = form.value.id; */
    const id = this.activetedRoute.snapshot.paramMap.get('id'); // id: string
    const datatn = Object.assign({}, form.value);
    const datakh = Object.assign({}, form.value);
    delete datakh.bienso;
    delete datakh.ngaytiepnhan;
    delete datakh.hieuxe;
    if (this.phieutiepnhan.suachuastt) {
      this.toarst.warning('Phiếu tiếp nhận này đã có phiếu sửa', 'Thất bại');
      this.isshow = true;
      return;
    }
    /* console.log(datatn);
    console.log(datakh); */
    /* this.tiepnhanService.Update(id, datatn);
    this.khachhangService.Update(this.phieutiepnhan.idkhachhang, datakh); */
    this.tiepnhanService.UpdateTNandKhach(id, datatn, this.phieutiepnhan.idkhachhang, datakh)
      .then(() => {
        this.toarst.success('Thành công', 'Cập nhật');
        this.isshow = true;
        this.goBack();
      },
      reject => {
        this.toarst.warning('Bạn không đủ quyền lực', 'Thất bại');
        this.isshow = true;
      })
      .catch(err => {
        this.toarst.error('Đã xảy ra lỗi', err);
        this.isshow = true;
      });
    /* this.toarst.success('Submitted Succesful!', 'sửa phiếu tiếp nhận'); */
  }
  getHieuxes() {
    this.subshieuxe = this.hieuxeService.getHieuXes().subscribe(actionArray => {
      this.hieuxeList = actionArray.map(item => {
        return {
          idhieuxe: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Hieuxe;
      });
    });
  }
  goBack() {
    this.location.back();
  }
  Search() {
    this.isshow1 = false;
    this.isshow2 = true;
    if (this.phieutiepnhan.bienso.length === 5) {
      this.tiepnhanService.Search(this.phieutiepnhan.bienso).subscribe(res => {
        this.isshow2 = false;
        this.isshow1 = true;
        this.xe = res;
        if (this.xe) {
          this.phieutiepnhan.hieuxe = this.xe.hieuxe;
        } else {
          this.phieutiepnhan.hieuxe = null;
        }
      });
    } else {
      this.isshow1 = false;
      this.isshow2 = false;
    }
  }
}
