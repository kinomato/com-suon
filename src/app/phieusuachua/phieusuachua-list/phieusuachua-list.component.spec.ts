import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieusuachuaListComponent } from './phieusuachua-list.component';

describe('PhieusuachuaListComponent', () => {
  let component: PhieusuachuaListComponent;
  let fixture: ComponentFixture<PhieusuachuaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieusuachuaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieusuachuaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
