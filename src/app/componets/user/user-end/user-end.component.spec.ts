import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEndComponent } from './user-end.component';

describe('UserEndComponent', () => {
  let component: UserEndComponent;
  let fixture: ComponentFixture<UserEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEndComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
