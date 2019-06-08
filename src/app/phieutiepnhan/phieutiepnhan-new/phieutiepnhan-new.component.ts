import { Component, OnInit } from '@angular/core';
import { PhieutiepnhanService } from '../../services/phieutiepnhan.service';
import { HieuxeService } from 'src/app/services/hieuxe.service';
import { Hieuxe } from 'src/app/models/hieuxe.model';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Xe } from 'src/app/interfaces/xe';

@Component({
  selector: 'app-phieutiepnhan-new',
  templateUrl: './phieutiepnhan-new.component.html',
  styleUrls: ['./phieutiepnhan-new.component.css']
})
export class PhieutiepnhanNewComponent implements OnInit {
  tenkhachhang: '';
  biensoxe = '';
  sodienthoai = '';
  diachikhach = '';
  tenhieuxe: string = null;
  selectedHieuxe: Observable<Hieuxe> = null;
  hieuxeList: Hieuxe[];
  currentdate: Date = new Date();
  model;
  temp = [];
  isshow = true;
  xe$: Observable<Xe>;
  xe: Xe;
  isshow1 = false;
  isshow2 = false;
  subshieuxe: Subscription;
  subsxe: Subscription;


  constructor(
    private tiepnhanService: PhieutiepnhanService,
    private hieuxeService: HieuxeService,
    private toastr: ToastrService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.getHieuxes();
    this.getDate();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subshieuxe.unsubscribe();
    this.subsxe.unsubscribe();
  }
  getHieuxes() {
    this.subshieuxe = this.hieuxeService.getHieuXes().subscribe(actionArray => {
      return this.hieuxeList = actionArray.map(item => {
        return {
          idhieuxe: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Hieuxe;
      });
    });
  }
  onSubmit(form: NgForm) {
    this.isshow = false;
    this.tiepnhanService.Submit(form).subscribe(res => {
      res.then(() => {
        this.toastr.success('Thêm thành công', 'Tiếp nhận xe');
      },
        () => {
          this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
        })
      .catch(err => {
        this.toastr.error(err, 'Đã xảy ra lỗi');
      }); /* .then(booleen => {
        if (booleen) {
          this.isshow = true;
          this.formReset(form);
        } else {
          this.isshow = true;
        }
      }); */
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
  formReset(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }
  }
  goBack() {
    this.location.back();
  }
  show() {
    this.temp.forEach(element => {
      console.log(element);
    });
  }
  Search() {
    this.isshow1 = false;
    this.isshow2 = true;
    if (this.biensoxe.length === 5) {
      this.tiepnhanService.Search(this.biensoxe).subscribe(res => {
        this.isshow2 = false;
        this.isshow1 = true;
        this.xe = res;
        if (this.xe) {
          this.tenhieuxe = this.xe.hieuxe;
        } else {
          this.tenhieuxe = null;
        }
      });
    } else {
      this.isshow1 = false;
      this.isshow2 = false;
    }
  }
  Apply() {
    /* this.subsxe = this.xe$.subscribe((xe: Xe) => {
      console.log(xe);
      this.tenhieuxe = xe.hieuxe;
      console.log(this.tenhieuxe);
    }); */
    this.tenhieuxe = this.xe.hieuxe;
  }
}
