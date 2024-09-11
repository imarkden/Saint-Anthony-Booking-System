import { Component, OnInit } from '@angular/core';
import { Guest } from 'src/app/_shared/models/guest.model';
import { GuestService } from 'src/app/_shared/services/guest.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  guests!: Guest[];
  error!: string;

  constructor(private guestService: GuestService) { }

  ngOnInit() {
    this.getGuests();
  }

  getGuests(): void {
    this.guestService.getAllGuests().subscribe(
      (guests: Guest[]) => {
        this.guests = guests;
      },
      (error) => {
        this.error = error.message;
      }
    );
  }
}