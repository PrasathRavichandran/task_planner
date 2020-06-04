import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateListTaskComponent } from './update-list-task.component';

describe('UpdateListTaskComponent', () => {
  let component: UpdateListTaskComponent;
  let fixture: ComponentFixture<UpdateListTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateListTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
