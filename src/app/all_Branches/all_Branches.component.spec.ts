/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { All_BranchesComponent } from './all_Branches.component';

describe('All_BranchesComponent', () => {
  let component: All_BranchesComponent;
  let fixture: ComponentFixture<All_BranchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ All_BranchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(All_BranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
