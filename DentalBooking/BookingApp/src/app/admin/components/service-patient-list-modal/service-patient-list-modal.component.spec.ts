import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePatientListModalComponent } from './service-patient-list-modal.component';

describe('ServicePatientListModalComponent', () => {
  let component: ServicePatientListModalComponent;
  let fixture: ComponentFixture<ServicePatientListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePatientListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePatientListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
