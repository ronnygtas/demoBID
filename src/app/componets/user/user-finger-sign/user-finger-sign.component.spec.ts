import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFingerSignComponent } from './user-finger-sign.component';

describe('UserFingerSignComponent', () => {
  let component: UserFingerSignComponent;
  let fixture: ComponentFixture<UserFingerSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFingerSignComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFingerSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
