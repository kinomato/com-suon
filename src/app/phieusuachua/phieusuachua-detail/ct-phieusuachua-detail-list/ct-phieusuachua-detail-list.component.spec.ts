import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtPhieusuachuaDetailListComponent } from './ct-phieusuachua-detail-list.component';

describe('CtPhieusuachuaDetailListComponent', () => {
  let component: CtPhieusuachuaDetailListComponent;
  let fixture: ComponentFixture<CtPhieusuachuaDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtPhieusuachuaDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtPhieusuachuaDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
