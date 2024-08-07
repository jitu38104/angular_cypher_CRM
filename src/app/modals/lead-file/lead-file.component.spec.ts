import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFileComponent } from './lead-file.component';

describe('LeadFileComponent', () => {
  let component: LeadFileComponent;
  let fixture: ComponentFixture<LeadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
