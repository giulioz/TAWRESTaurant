import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavsCashierComponent } from './navs-cashier.component';

describe('NavsCashierComponent', () => {
  let component: NavsCashierComponent;
  let fixture: ComponentFixture<NavsCashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavsCashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavsCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
