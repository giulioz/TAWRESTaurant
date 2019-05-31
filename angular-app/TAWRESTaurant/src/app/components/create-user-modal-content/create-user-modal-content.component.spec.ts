import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserModalContentComponent } from './create-user-modal-content.component';

describe('CreateUserModalContentComponent', () => {
  let component: CreateUserModalContentComponent;
  let fixture: ComponentFixture<CreateUserModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
