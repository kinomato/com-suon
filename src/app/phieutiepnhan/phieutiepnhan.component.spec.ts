import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieutiepnhanComponent } from './phieutiepnhan.component';

describe('PhieutiepnhanComponent', () => {
  let component: PhieutiepnhanComponent;
  let fixture: ComponentFixture<PhieutiepnhanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieutiepnhanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieutiepnhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
