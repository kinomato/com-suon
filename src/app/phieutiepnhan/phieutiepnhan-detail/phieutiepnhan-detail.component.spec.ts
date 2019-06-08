import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieutiepnhanDetailComponent } from './phieutiepnhan-detail.component';

describe('PhieutiepnhanDetailComponent', () => {
  let component: PhieutiepnhanDetailComponent;
  let fixture: ComponentFixture<PhieutiepnhanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieutiepnhanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieutiepnhanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
