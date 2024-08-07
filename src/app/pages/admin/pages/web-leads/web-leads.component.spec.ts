import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebLeadsComponent } from './web-leads.component';

describe('WebLeadsComponent', () => {
  let component: WebLeadsComponent;
  let fixture: ComponentFixture<WebLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
