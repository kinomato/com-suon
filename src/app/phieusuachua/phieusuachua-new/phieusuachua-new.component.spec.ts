import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieusuachuaNewComponent } from './phieusuachua-new.component';

describe('PhieusuachuaNewComponent', () => {
  let component: PhieusuachuaNewComponent;
  let fixture: ComponentFixture<PhieusuachuaNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhieusuachuaNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieusuachuaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
