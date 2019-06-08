import { Component, OnInit } from '@angular/core';
import { PhieusuachuaService } from '../../services/phieusuachua.service';
import { Phieusuachua } from 'src/app/models/phieusuachua.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-phieusuachua-list',
  templateUrl: './phieusuachua-list.component.html',
  styleUrls: ['./phieusuachua-list.component.css']
})
export class PhieusuachuaListComponent implements OnInit {
  suachuaList$: Observable<Phieusuachua[]>;
  searchvalue;
  key = 'bienso'; // set default
  reverse = false;
  p = 1;
  subsuachua: Subscription;
  constructor(
    private suachuaService: PhieusuachuaService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.getSuachuas();
  }
  OnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subsuachua.unsubscribe();
  }
  getSuachuas() {
    this.suachuaList$ = this.suachuaService.getPhieusuachuas().pipe(
      map(res => {
        return res.map(item => {
          return {
            idphieusuachua: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Phieusuachua;
        });
      })
    );
  }
  onDelete(id: string) {
    if (confirm('Are you sure ?')) {
      this.suachuaService.Delete(id)
      .then(() => {
        this.toastr.success('Đã thêm vào thùng rác', 'Phiếu sửa chữa');
      },
      reject => {
        this.toastr.warning('Bạn không đủ quyền lực', 'Thất bại');
      })
      .catch(err => {
        this.toastr.error('Đã xảy ra lỗi', err);
      });
    }
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
