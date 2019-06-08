import { Component, OnInit } from '@angular/core';
import { PhieutiepnhanService } from '../../services/phieutiepnhan.service';
import { Phieutiepnhan } from 'src/app/models/phieutiepnhan.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-phieutiepnhan-list',
  templateUrl: './phieutiepnhan-list.component.html',
  styleUrls: ['./phieutiepnhan-list.component.css']
})
export class PhieutiepnhanListComponent implements OnInit {
  dataList = [];
  phieuList: Phieutiepnhan[];
  searchvalue: string;
  templist = [];
  newList = new BehaviorSubject(null as any);
  isshow = false;
  key = 'bienso'; // set default
  reverse = false;
  p = 1;

  substiepnhan: Subscription;
  constructor(
    private tiepnhanService: PhieutiepnhanService,
    private toastr: ToastrService
  ) {  }

  ngOnInit() {
    this.getThongtin();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.substiepnhan.unsubscribe();
  }
  getThongtin() {
    this.substiepnhan = this.tiepnhanService.getThongtinsUlt().subscribe(res => {
      this.newList.next(res);
    });
  }
  onDelete(id: string) {
    if (confirm('are you sure ?')) {
      this.tiepnhanService.Delete(id)
      .then(() => {
        this.toastr.success('Đã thêm vào thùng rác', 'Xóa phiếu nhập');
      },
      () => {
        this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
      })
      .catch(err => {
        this.toastr.error('Xóa thất bại', err);
      });
    }
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
