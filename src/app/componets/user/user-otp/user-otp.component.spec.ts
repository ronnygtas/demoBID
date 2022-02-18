import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOtpComponent } from './user-otp.component';

describe('UserOtpComponent', () => {
  let component: UserOtpComponent;
  let fixture: ComponentFixture<UserOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOtpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
