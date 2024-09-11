import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from 'src/app/_shared/models/guest.model';

@Component({
  selector: 'app-service-book-list-modal',
  templateUrl: './service-book-list-modal.component.html',
  styleUrls: ['./service-book-list-modal.component.scss']
})
export class ServiceBookListModalComponent {
  @Input() booking!: Guest[];

  constructor(public activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();
  }
}
