import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { phoneValidator } from 'src/app/_shared/helpers/phone.validator';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { Guest } from 'src/app/_shared/models/guest.model';
import { Service } from 'src/app/_shared/models/service.model';
import { GuestService } from 'src/app/_shared/services/guest.service';
import { ServiceService } from 'src/app/_shared/services/service.service';


@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  styleUrls: ['./book-now.component.scss']
})
export class BookNowComponent {
  
  bookForm!: FormGroup;
  services!: Service[]
  selectedService = '';
  selectedDate: Date = new Date();
  guestSlot!: Guest[];
  selectedTime: string = '';
  guests!: Guest[];
  availableTimes: string[] = [];
  disabledTimes: string[] = [];
  minDate!: Date;
  currentDate!: Date;
  minDateString!: string;
  displayDate: string = '';


  hours = Array.from({length: 9}, (_, i) => i + 10); // 9 to 18
  minutes = ['00', '15', '30', '45'];

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private guestService: GuestService,
    private serviceService: ServiceService,
    private location: Location) {
  }

  ngOnInit() {
    this.getServices();
    this.fetchGuests();
    this.getAllGuests();

    this.currentDate = new Date();
    this.minDate = new Date(this.currentDate.getTime());
    const year = this.minDate.getFullYear();
    const month = String(this.minDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.minDate.getDate()).padStart(2, '0');
    this.minDateString = `${year}-${month}-${day}`;

    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z,.\\s]+$')]],
      phone: ['', [Validators.required, phoneValidator]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      service: ['', Validators.required],
      selectedDate: ['', Validators.required],
      selectedTime: ['', Validators.required]
    });

  }

  addBook(): void {
    if(this.bookForm.valid){
      this.guestService.createGuest(this.bookForm.value)
      .subscribe({
        next: (res => {
          this.toast.success({detail: "SUCCESS", summary: "Booked schedule has been sent.", duration: 3000})
          this.bookForm.reset();
          this.getAllGuests();
        }),
        error: (err => {
          alert("Error");
        })
      })
    } else {
      console.log('Invalid');
      ValidateForm.validateFormFields(this.bookForm)
    }
  }

  getServices(): void {
    this.serviceService.getAllServicess()
      .subscribe(services => this.services = services);
  }
  
  fetchGuests(): void {
    this.guestService.getOngoingGuests().subscribe((guests: Guest[]) => {
      this.guests = guests;
      console.log(this.guests); // check if guests are being fetched correctly
    }, error => {
      console.log('Error fetching guests:', error);
    });
  }

  isTimeDisabled(time: string): boolean {
    // Check if the time slot is disabled
    return this.disabledTimes.includes(time);
  }

  hasConflict(): boolean {
    const selectedDateValue = this.bookForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = this.bookForm.get('selectedTime')?.value;
  
    if (this.guestSlot && Array.isArray(this.guestSlot)) {
  
      for (const guest of this.guestSlot) {
        const guestDate = new Date(guest.selectedDate);
        const guestTime = guest.selectedTime;

  
        if (guestDate.getDate() === selectedDate.getDate()) {
          // Convert guest time to Date object
          const guestTimeDate = new Date();
          guestTimeDate.setHours(parseInt(guestTime.slice(0, 2)));
          guestTimeDate.setMinutes(parseInt(guestTime.slice(3, 5)));
  
          // Convert selected time to Date object
          const selectedTimeDate = new Date();
          selectedTimeDate.setHours(parseInt(selectedTime.slice(0, 2)));
          selectedTimeDate.setMinutes(parseInt(selectedTime.slice(3, 5)));
  
          if (selectedTimeDate < guestTimeDate) {
            // Selected time is before guest time, no conflict
            continue;
          }
  
          // Calculate guest time + 30 minutes
          const guestTimePlus30 = new Date(guestTimeDate.getTime() + 30 * 60000);
  
          if (selectedTimeDate >= guestTimeDate && selectedTimeDate < guestTimePlus30) {
            // Conflict found
            return true;
          }
        }
      }
    }
  
    return false;
  }

  isSubmitDisabled(): boolean {
    return this.hasConflict();
  }

  isTimeAvailable(hour: number, minute: string): boolean {
    const selectedDateValue = this.bookForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = `${hour}:${minute}`;
  
    if (this.guestSlot && Array.isArray(this.guestSlot)) {
      for (const patient of this.guestSlot) {
        const guestDate = new Date(patient.selectedDate);
        const guestTime = patient.selectedTime;
  
        if (guestDate.getDate() === selectedDate.getDate()) {
          const guestTimeDate = new Date();
          guestTimeDate.setHours(parseInt(guestTime.slice(0, 2)));
          guestTimeDate.setMinutes(parseInt(guestTime.slice(3, 5)));
  
          const selectedTimeDate = new Date();
          selectedTimeDate.setHours(hour);
          selectedTimeDate.setMinutes(parseInt(minute));
  
          if (selectedTimeDate < guestTimeDate) {
            continue;
          }
  
          const guestTimePlus30 = new Date(guestTimeDate.getTime() + 30 * 60000);
  
          if (selectedTimeDate >= guestTimeDate && selectedTimeDate < guestTimePlus30) {
            return false; // Conflict found, time slot not available
          }
        }
      }
    }
  
    return true; // No conflict found, time slot is available
  }

  updateSelectedDate(event: any): void {
    this.displayDate = event.target.value;
    // Additional logic or function calls based on the selected date
    // For example, you can call the fetchGuests() function here if needed
  }

  refreshComponent() {
    this.location.replaceState(this.location.path(true));
    window.location.reload();
  }

  getAllGuests(): void {
    this.guestService.getAllGuests().subscribe(
      (data: Guest[]) => {
        this.guestSlot = data.filter((p)=> p.status === "Ongoing" || p.status === "Pending")
      }
    )
  }
}