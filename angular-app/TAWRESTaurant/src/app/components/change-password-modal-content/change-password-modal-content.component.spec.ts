import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordModalContentComponent } from './change-password-modal-content.component';

describe('ChangePasswordModalContentComponent', () => {
  let component: ChangePasswordModalContentComponent;
  let fixture: ComponentFixture<ChangePasswordModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
