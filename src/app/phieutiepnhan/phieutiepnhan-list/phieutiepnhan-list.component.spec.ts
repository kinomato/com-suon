import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieutiepnhanListComponent } from './phieutiepnhan-list.component';

describe('PhieutiepnhanListComponent', () => {
  let component: PhieutiepnhanListComponent;
  let fixture: ComponentFixture<PhieutiepnhanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieutiepnhanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieutiepnhanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
