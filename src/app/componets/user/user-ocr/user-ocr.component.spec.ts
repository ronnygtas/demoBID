import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOcrComponent } from './user-ocr.component';

describe('UserOcrComponent', () => {
  let component: UserOcrComponent;
  let fixture: ComponentFixture<UserOcrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOcrComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
