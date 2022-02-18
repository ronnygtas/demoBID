import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFacialComponent } from './user-facial.component';

describe('UserFacialComponent', () => {
  let component: UserFacialComponent;
  let fixture: ComponentFixture<UserFacialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFacialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
