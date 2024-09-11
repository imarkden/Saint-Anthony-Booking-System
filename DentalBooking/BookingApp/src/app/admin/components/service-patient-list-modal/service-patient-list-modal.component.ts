import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Patient } from 'src/app/_shared/models/patient.model';

@Component({
  selector: 'app-service-patient-list-modal',
  templateUrl: './service-patient-list-modal.component.html',
  styleUrls: ['./service-patient-list-modal.component.scss']
})
export class ServicePatientListModalComponent {
  @Input() patients!: Patient[];

  constructor(public activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();
  }
}
