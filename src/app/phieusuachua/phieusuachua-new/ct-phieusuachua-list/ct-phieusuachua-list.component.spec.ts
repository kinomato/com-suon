import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CTPhieusuachuaListComponent } from './ct-phieusuachua-list.component';

describe('CTPhieusuachuaListComponent', () => {
  let component: CTPhieusuachuaListComponent;
  let fixture: ComponentFixture<CTPhieusuachuaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CTPhieusuachuaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CTPhieusuachuaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
