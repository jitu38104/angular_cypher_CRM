import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInvoiceComponent } from './lead-invoice.component';

describe('LeadInvoiceComponent', () => {
  let component: LeadInvoiceComponent;
  let fixture: ComponentFixture<LeadInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
