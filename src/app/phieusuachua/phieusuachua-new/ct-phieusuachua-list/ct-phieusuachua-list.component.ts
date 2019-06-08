import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CTPhieusuachua } from 'src/app/models/ct-phieusuachua.model';
import { PhieusuachuaService } from '../../../services/phieusuachua.service';
import { Phutung } from 'src/app/models/phutung.model';
import { Tiencong } from 'src/app/models/tiencong.model';
import { PhieutiepnhanService } from 'src/app/services/phieutiepnhan.service';
import { TiencongService } from 'src/app/services/tiencong.service';
import { PhutungService } from 'src/app/services/phutung.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ct-phieusuachua-list',
  templateUrl: './ct-phieusuachua-list.component.html',
  styleUrls: ['./ct-phieusuachua-list.component.css']
})
export class CTPhieusuachuaListComponent implements OnInit {
  ctsuachuaList: CTPhieusuachua[] = [];
  /* itemptlist = new BehaviorSubject([]); */
  ptbooleanlist = [];
  /* tcbooleanlist = []; */
  selectedPTList = [];
  /* selectedTCList = []; */
  phutungList = [];
  tiencongList = [];
  configpt;
  configtc;
  isunvalid = true;
  tongtien = 0;
  isreadonly = true;
  maxsl = 1;
  subphutung: Subscription;
  subtiencong: Subscription;
  @Output() tinhtien = new EventEmitter<number>();
  constructor(
    private suachuaService: PhieusuachuaService,
    private tiepnhanService: PhieutiepnhanService,
    private tiencongService: TiencongService,
    private phutungService: PhutungService
  ) {
    this.configpt = {
      displayKey: 'tenphutung', // if objects array passed which key to be displayed defaults to description
      search: true, // true/false for the search functionlity defaults to false,
      height: 'auto', // height of the list so that if there are more no of items
      // it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Chọn Phụ tùng', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants
      // to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 10, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'tenphutung' // key on which search should be performed this will be selective search.
      // if undefined this will be extensive search on all keys
    };
    this.configtc = {
      displayKey: 'tenloaitiencong', // if objects array passed which key to be displayed defaults to description
      search: true, // true/false for the search functionlity defaults to false,
      height: 'auto', // height of the list so that if there are more no of items
      // it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Chọn Tiền công', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants
      // to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 10, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'tenloaitiencong' // key on which search should be performed this will be selective search.
      // if undefined this will be extensive search on all keys
    };
  }

  ngOnInit() {
    this.getPhutungs();
    this.getTiencongs();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subphutung.unsubscribe();
    this.subtiencong.unsubscribe();
  }
  onDelete(data: any) {
    const index = this.ctsuachuaList.indexOf(data, 0);
    if (index > -1) {
      this.ctsuachuaList.splice(index, 1);
      this.selectedPTList.splice(index, 1);
      this.updateStatusPT();
      this.tinhTongTien();
    } else {
      console.log('something gone wrong');
    }
  }
  add() {
    const newObj = new CTPhieusuachua('', undefined, null, null, undefined, null);
    const temp = JSON.parse(JSON.stringify(newObj));
    this.ctsuachuaList.push(temp);
    this.tinhTongTien();
    /* this.onDelete(temp);
    this.ctsuachuaList.push(temp); */
  }
  getPhutungs() {
    this.subphutung = this.phutungService.getPhutungs().subscribe(res => {
      this.phutungList = res.map(item => {
        return {
          idphutung: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Phutung;
      });
      return this.updateStatusPT();
    });
  }
  getTiencongs() {
    this.subtiencong = this.tiencongService.getTiencongs().subscribe(res => {
      return this.tiencongList = res.map(item => {
        return {
          idtiencong: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Tiencong;
      });
    });
  }
  checkSL(ctsuachua: CTPhieusuachua) {
    const index = this.phutungList.indexOf(ctsuachua.phutung, 0);
    if (ctsuachua.soluong > this.phutungList[index].soluongconlai) {
      ctsuachua.soluong = this.phutungList[index].soluongconlai;
    }
    if ( ctsuachua.soluong < 1 ) {
      ctsuachua.soluong = 1;
    }
    this.calculate(ctsuachua);
  }
  calculate(ctsuachua: CTPhieusuachua) {
    const index = this.ctsuachuaList.indexOf(ctsuachua, 0);
    const sl = this.ctsuachuaList[index].soluong;
    const dongia = this.ctsuachuaList[index].dongia;
    const tiencong = this.ctsuachuaList[index].tiencong;
    if (tiencong === undefined || tiencong === null) {
      this.ctsuachuaList[index].thanhtien = null;
      return this.tinhTongTien();
    }
    this.ctsuachuaList[index].thanhtien = dongia * sl + +tiencong.muctiencong;
    this.tinhTongTien();
  }
  tinhTongTien() {
    let temptong = 0;
    const count = this.ctsuachuaList.length;
    for (let i = 0; i < count; i++) {
      if (this.ctsuachuaList[i].thanhtien === null) {
        temptong = null;
        break;
      }
      temptong += this.ctsuachuaList[i].thanhtien;
    }
    /* this.ctsuachuaList.forEach(item => {
      temptong += item.thanhtien;
    }); */
    this.tongtien = temptong;
    this.tinhtien.emit(this.tongtien);
  }
  changePT(selecteditem1: CTPhieusuachua) {
    const index1 = this.ctsuachuaList.indexOf(selecteditem1, 0);
    const item = this.ctsuachuaList[index1];
    this.selectedPTList[index1] = item.phutung.idphutung;
    this.updateStatusPT();
    if (item.phutung === undefined || item.phutung === null) {
      this.ctsuachuaList[index1].dongia = null;
      /* this.calculate(selecteditem1); */
      this.checkSL(selecteditem1);
    } else {
      item.dongia = +item.phutung.giaphutung;
      /* this.calculate(selecteditem1); */
      this.checkSL(selecteditem1);
    }
  }
  /* changeTC(selecteditem1: CTPhieusuachua) {
    const index1 = this.ctsuachuaList.indexOf(selecteditem1, 0);
    const item = this.ctsuachuaList[index1];
    this.selectedTCList[index1] = item.tiencong.tenloaitiencong;
    this.updateStatusTC();
    this.calculate(selecteditem1);
  } */
  updateStatusPT() {
    let i = 0;
    this.phutungList.forEach(item => {
      const selected = this.selectedPTList.includes(item.idphutung);
      this.ptbooleanlist[i] = selected;
      i ++;
    });
  }
  /* updateStatusTC() {
    let i = 0;
    this.tiencongList.forEach(item => {
      const selected = this.selectedTCList.includes(item.tenloaitiencong);
      this.tcbooleanlist[i] = selected;
      i ++;
    });
  } */
  show() {
    /* this.ctsuachuaList.forEach(item => {
      console.log(item);
      console.log(this.ctsuachuaList.indexOf(item));
    }); */
    /* console.log(this.ctsuachuaList.length);
    this.itemptlist.forEach(item => {
      console.log(item);
    }); */
  }
  /* onSubmit(id: string) {
    this.suachuaService.ctSubmit(id, this.ctsuachuaList);
    this.formReset();
  } */
  formReset() {
    const length = this.ctsuachuaList.length;
    this.ctsuachuaList.splice(0, length);
  }
  test(form: NgForm) {
    console.log(form.value);
  }
  customComparePT(phutung1: Phutung, phutung2: Phutung) {
    return phutung1.idphutung === phutung2.idphutung;
  }
  customCompareTC(tc1: Tiencong, tc2: Tiencong) {
    return tc1.idtiencong === tc2.idtiencong;
  }
}
