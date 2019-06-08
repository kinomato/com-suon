import { Component, OnInit, ViewChild } from '@angular/core';
import { CtPhieusuachuaDetailListComponent } from './ct-phieusuachua-detail-list/ct-phieusuachua-detail-list.component';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';
import { Phieusuachua } from 'src/app/models/phieusuachua.model';
import { ToastrService } from 'ngx-toastr';
import { PhieusuachuaService } from '../../services/phieusuachua.service';
import { PhieutiepnhanService } from 'src/app/services/phieutiepnhan.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { forkJoin, observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-phieusuachua-detail',
  templateUrl: './phieusuachua-detail.component.html',
  styleUrls: ['./phieusuachua-detail.component.css']
})
export class PhieusuachuaDetailComponent implements OnInit {
  phieusuachua = new Phieusuachua('', { day: '', month: '', year: '' }, 0);
  currentdate: Date = new Date();
  model = {};
  tiepnhantemp: any;
  tiepnhanList: Phieutiepnhan[] = [];
  config;
  invalid = false;
  isshow = true;
  tongtien = 0;
  subtiepnhan: Subscription;
  subsuachua: Subscription;
  @ViewChild(CtPhieusuachuaDetailListComponent)
  mychild: CtPhieusuachuaDetailListComponent;
  constructor(
    private toastr: ToastrService,
    private suachuaService: PhieusuachuaService,
    private tiepnhanService: PhieutiepnhanService,
    private location: Location,
    private activetedRoute: ActivatedRoute
  ) {
    this.config = {
      displayKey: 'bienso', // if objects array passed which key to be displayed defaults to description
      search: true, // true/false for the search functionlity defaults to false,
      height: 'auto', // height of the list so that if there are more no of items
      // it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Biển số', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants
      // to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 10, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'bienso' // key on which search should be performed this will be selective search.
      // if undefined this will be extensive search on all keys
    };
  }

  ngOnInit() {
    this.getPhieutiepnhans();
    this.getPhieusuachua();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subsuachua.unsubscribe();
    this.subtiepnhan.unsubscribe();
  }
  onSave(data: NgForm) {
    this.isshow = false;
    const id = this.activetedRoute.snapshot.paramMap.get('id');
    const temp = Object.assign({}, data.value);
    temp.bienso = this.tiepnhantemp.bienso;
    if (this.phieusuachua.thutienstt) {
      this.toastr.warning('Phiếu sửa chữa đã được thanh toán', 'Thất bại');
      this.isshow = true;
      return;
    }
    const deleteList = this.mychild.deleteList;
    const ctsuachuaList = this.mychild.ctsuachuaList;
    this.suachuaService.UpdateUtl(id, temp, ctsuachuaList, this.mychild.oldctsuachuaList, deleteList)
    .then(() => {
      this.toastr.success('Cập nhật thành công', 'Phiếu sửa chữa');
      this.isshow = true;
      this.location.back();
    },
    () => {
      this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
      this.isshow = true;
    })
    .catch(err => {
      this.toastr.error(err, 'Đã xảy ra lỗi');
    });
  }
  getPhieutiepnhans() {
    this.subtiepnhan = this.tiepnhanService.getTiepnhans().subscribe(res => {
      return this.tiepnhanList = res.map(item => {
        return {
          idphieutiepnhan: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Phieutiepnhan;
      });
    },
      err => console.log(err),
    );
  }
  getPhieusuachua() {
    const id = this.activetedRoute.snapshot.paramMap.get('id');
    this.subsuachua = this.suachuaService.getPhieusuachua(id).subscribe((data: Phieusuachua) => {
      this.phieusuachua = Object.assign({}, data);
      this.model = Object.assign({}, this.phieusuachua.ngaysuachua);
      this.tongtien = this.phieusuachua.tongtien;
      this.initialize(data.bienso);
      this.mychild.getCTphieusuachua(id);
    },
      err => console.log(err),
      () => console.log('complete'));
  }
  initialize(bienso: string) {
    this.suachuaService.getPhieutiepnhan(bienso).subscribe(actionArray => {
      return actionArray.map(item => {
        return this.tiepnhantemp = Object.assign({}, {
          idphieutiepnhan: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Phieutiepnhan);
      });
    });
  }
  getDate() {
    const day = this.currentdate.getDate();
    const month = this.currentdate.getMonth() + 1;
    const year = this.currentdate.getFullYear();
    this.model = {
      year,
      month,
      day
    };
  }
  tinhTien(event: any) {
    if (event === null) {
      this.invalid = true;
    } else {
      this.invalid = false;
    }
  }
  formReset(form?: NgForm) {
    if (form) {
      form.resetForm();
      this.tiepnhantemp = undefined;
    }
  }
  change() {
    if (this.tiepnhantemp !== undefined) {
      console.log(this.tiepnhantemp);
    }
  }
  show() {
    console.log(this.model);
    console.log(this.tiepnhantemp);
    console.log(this.phieusuachua);
    this.mychild.ctsuachuaList.forEach(element => {
      console.log(element);
    });
  }
  goBack() {
    this.location.back();
  }
}
