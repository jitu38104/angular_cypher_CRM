import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSomthingComponent } from './add-new-somthing.component';

describe('AddNewSomthingComponent', () => {
  let component: AddNewSomthingComponent;
  let fixture: ComponentFixture<AddNewSomthingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewSomthingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewSomthingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
