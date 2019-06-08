import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieusuachuaDetailComponent } from './phieusuachua-detail.component';

describe('PhieusuachuaDetailComponent', () => {
  let component: PhieusuachuaDetailComponent;
  let fixture: ComponentFixture<PhieusuachuaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieusuachuaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieusuachuaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
