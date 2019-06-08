import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieusuachuaComponent } from './phieusuachua.component';

describe('PhieusuachuaComponent', () => {
  let component: PhieusuachuaComponent;
  let fixture: ComponentFixture<PhieusuachuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieusuachuaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieusuachuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
