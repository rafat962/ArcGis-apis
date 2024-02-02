/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Best_roadComponent } from './best_road.component';

describe('Best_roadComponent', () => {
  let component: Best_roadComponent;
  let fixture: ComponentFixture<Best_roadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Best_roadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Best_roadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
