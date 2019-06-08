import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieutiepnhanNewComponent } from './phieutiepnhan-new.component';

describe('PhieutiepnhanNewComponent', () => {
  let component: PhieutiepnhanNewComponent;
  let fixture: ComponentFixture<PhieutiepnhanNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieutiepnhanNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieutiepnhanNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
