import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIneComponent } from './user-ine.component';

describe('UserIneComponent', () => {
  let component: UserIneComponent;
  let fixture: ComponentFixture<UserIneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIneComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
