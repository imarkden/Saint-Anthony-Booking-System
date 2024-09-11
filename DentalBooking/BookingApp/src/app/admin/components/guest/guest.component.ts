import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Guest } from 'src/app/_shared/models/guest.model';
import { Service } from 'src/app/_shared/models/service.model';
import { GuestService } from 'src/app/_shared/services/guest.service';
import { ServiceService } from 'src/app/_shared/services/service.service';
  import { Location } from '@angular/common';
import { phoneValidator } from 'src/app/_shared/helpers/phone.validator';
import { PatientService } from 'src/app/_shared/services/patient.service';
import { Patient } from 'src/app/_shared/models/patient.model';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { Doctor } from 'src/app/_shared/models/doctor.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';


@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {
  guests!: Guest[];
  selectedGuest: Guest = {} as Guest;
  guestForm!: FormGroup;
  services!: Service[];
  doctors!: Doctor[];
  selectedService = '';
  selectedDate: Date = new Date();
  selectedTime: string = '';
  guestSlot!: Guest[];
  addPatientForm!: FormGroup;
  patients!: Patient[];

  selectService = ''
  selectDoctor = ''
  serviceCost: any;
  addServiceCost: any;
  
  sortBy: string = 'id';
  hours = Array.from({ length: 10 }, (_, i) => i + 10);
  minutes = ['00', '15', '30', '45'];
 
  minDate!: Date;
  currentDate!: Date;
  minDateString!: string;

  minDate2!: Date;
  currentDate2!: Date;
  minDateString2!: string;

  displayDate: string = '';
  dateTime!: string;
  private timer: any;
  showTable: boolean = false;
  disabledTimes: string[] = [];

  isOngoing = false;
  isPending = false;
  isToday = true;
  isHistory = false;

  isDatePickerVisible = false;


  constructor(private guestService: GuestService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private serviceService: ServiceService,
    private location: Location) {}

  ngOnInit(): void {
    this.getTodayGuests();
    this.getServices();
    this.updateDateTime();
    this.startTimer();
    this.getTodayGuests();
    this.getAllGuests();
    this.getDoctors();
    this.getOngoingPatients();

    this.currentDate = new Date();
    this.minDate = new Date(this.currentDate.getTime());
    const year = this.minDate.getFullYear();
    const month = String(this.minDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.minDate.getDate()).padStart(2, '0');
    this.minDateString = `${year}-${month}-${day}`;

    this.currentDate2 = new Date();
    this.minDate2 = new Date(this.currentDate.getTime());
    const year2 = this.minDate.getFullYear();
    const month2 = String(this.minDate.getMonth() + 1).padStart(2, '0');
    const day2 = String(this.minDate.getDate()).padStart(2, '0');
    this.minDateString2 = `${year2}-${month2}-${day2}`;

    this.guestForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      phone: ['', [Validators.required, phoneValidator]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      service: ['', Validators.required],
      selectedDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      selectedTime: ['', Validators.required],
      status: ['', Validators.required,]
    });

    this.addPatientForm = this.formBuilder.group({
      name: [this.selectedGuest?.name || '', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      phone: ['', [Validators.required, phoneValidator]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      selectedService: ['', Validators.required],
      selectedDoctor: ['', Validators.required],
      selectedDate: ['', Validators.required],
      selectedTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      cost: [''],
      additionalCost: ['', Validators.pattern(/^[0-9]\d*$/)],
      note: ['']
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  getAll(): void{
    this.getOngoingGuests();
    this.getPendingGuests();
    this.getCancelGuests();
    this.getSuccessGuests();
  }

  getOngoingGuests(): void {
    this.guestService.getOngoingGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPendingGuests(): void {
    this.guestService.getPendingGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getTodayGuests(): void {
    this.guestService.getTodayGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getFailGuests(): void {
    this.guestService.getFailGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getCancelGuests(): void {
    this.guestService.getCancelGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getSuccessGuests(): void {
    this.guestService.getSuccessGuests().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getGuestsHistory(): void {
    this.guestService.getGuestHistory().subscribe(
      (data: Guest[] | any) => {
        if (Array.isArray(data)) {
          this.guests = data;
        } else {
          console.error('Response data is not an array:', data);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  editGuest(): void {
    if (this.guestForm.valid) {
      const guestData = this.guestForm.value;
      const guestId = this.selectedGuest.id;

      this.guestService.updateGuest(guestId, guestData).subscribe(
        response => {
          console.log('Guest updated successful', response);
          this.toast.warning({detail: "SUCCESS", summary: "Guest successfully changed.", duration: 3000});
          this.guestForm.reset();
          this.getPendingGuests();
          this.getServices();
          this.getOngoingGuests();
          this.clearModal();

          const buttonRef = document.getElementById("closeEdit");
          buttonRef?.click();
        },
        error => {
          console.error("Error updating the guest:", error);
        }
      );
    } else {
      console.error("invalid form data");
    }
  }

  selectGuest(guest: Guest): void {
    this.selectedGuest = guest;
    const selectedDate = new Date(guest.selectedDate);
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    this.guestForm.patchValue({
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
      age: guest.age,
      service: guest.service,
      selectedTime: guest.selectedTime,
      selectedDate: formattedDate,
      status: guest.status
    });

    this.addPatientForm.patchValue({
      name: guest.name,
      phone: guest.phone,
      age: guest.age
    });
  }
  

  clearModal() {
    this.guestForm.reset();
    this.refreshComponent();
  }

  sortGuests(): void {
    this.guests.sort((a, b) => {
      if (this.sortBy === 'id') {
        return a.id - b.id;
      } else if (this.sortBy === 'date') {
        const dateA = new Date(a.selectedDate);
        const dateB = new Date(b.selectedDate);
        const timeA = Date.parse(`01/01/2000 ${a.selectedTime}`);
        const timeB = Date.parse(`01/01/2000 ${b.selectedTime}`);
        const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));
        const dateTimeB = new Date(dateB.setHours(new Date(timeB).getHours(), new Date(timeB).getMinutes()));
        console.log(dateTimeA)
        return dateTimeA.getTime() - dateTimeB.getTime();
      } else if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });
  }
  
  isEditDisabled(guest: Guest): boolean {
    return guest.status === 'Fail' || guest.status === 'Cancel' || guest.status === 'Success';
  }

  deleteGuest(id: number): void {
    if(confirm('Are you sure you want to delete this service?')) {
      this.guestService.deleteGuest(id).subscribe(
        (data: any) => {
          this.getOngoingGuests();
          this.getPendingGuests();
          this.toast.warning({detail: "WARNING", summary: "One service has been removed.", duration: 3000})
        },
        (error: any) => {
          console.log(error)
        }
      )
    }
  }

  isSubmitDisabled(): boolean {
    return this.hasConflict();
  }

  getServices(): void {
    this.serviceService.getAllServicess()
      .subscribe(services => this.services = services);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  isValidDate(): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const date = this.guestForm.get('selectedDate')?.value;
    return regex.test(date);
  }
  
  refreshComponent() {
    this.location.replaceState(this.location.path(true));
    window.location.reload();
  }

  updateGuestStatusSuccess() {
    if (this.selectedGuest) {
      console.log(this.selectedGuest.id)
      this.guestService.updateGuestStatusSuccess(this.selectedGuest.id)
        .subscribe(() => {
          const buttonRef = document.getElementById("closeModal");
          buttonRef?.click();
          // handle success
        }, (error) => {
          // handle error
        });
    }
  }

  updateGuestStatusConfirm() {
    if (this.selectedGuest) {
      console.log(this.selectedGuest.id)
      this.guestService.updateGuestStatusConfirm(this.selectedGuest.id)
        .subscribe(() => {
          const buttonRef = document.getElementById("closeModal");
          buttonRef?.click();
          // handle success
        }, (error) => {
          // handle error
        });
    }
  }

  updateGuestStatusCancel() {
    if (this.selectedGuest) {
      console.log(this.selectedGuest.id)
      this.guestService.updateGuestStatusCancel(this.selectedGuest.id)
        .subscribe(() => {
          const buttonRef = document.getElementById("closeModal");
          buttonRef?.click();
          // handle success
        }, (error) => {
          // handle error
        });
    }
  }
  
  setStatusModal(guestId: number) {
    this.selectedGuest.id = guestId;
  }

  closeModal() {
    if(this.isOngoing == true) {
      this.getOngoingGuests();
    } else if(this.isToday == true) {
      this.getTodayGuests();
    } else if(this.isPending == true) {
      this.getPendingGuests();
    }
  }

  isActiveOngoing(): void {
    this.getOngoingGuests();
    this.isOngoing = true;
    this.isToday = false;
    this.isPending = false;
    this.isHistory = false;
    // your code here
  }

  isActivePending(): void {
    this.getPendingGuests();
    this.isPending = true;
    this.isOngoing = false;
    this.isToday = false;
    this.isHistory = false;
    // your code here
  }

  isActiveToday(): void {
    this.getTodayGuests();
    this.isToday = true;
    this.isOngoing = false;
    this.isPending = false;
    this.isHistory = false;
    // your code here
  }

  isActiveHistory(): void {
    this.getGuestsHistory();
    this.isHistory = true;
    this.isToday = false;
    this.isOngoing = false;
    this.isPending = false;
  }

  printList(): void {
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
    const logo = '<img src="../../../assets/logo.png" width="200" height="200" style="display: block; margin: 0 auto; line-height: 1px">';
    const clinicName = '<h2 style="text-align: center; line-height: 1px">Saint Anthony Dental Clinic</h2>';
    const address = '<p style="text-align: center; line-height: 1px ">1 Ballecer, South Signal Village, Taguig, 1632 Metro Manila, Philippines</p>';
    const lineSpacing = '<br/><br/>';
  
    const tableStyle = 'border: 1px solid #dee2e6; border-collapse: collapse; width: 100%;';
    const thStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px; text-align: left; background-color: #f2f2f2;';
    const tdStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px;';
  
    const tableHead = `
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Name</th>
            <th style="${thStyle}">Phone</th>
            <th style="${thStyle}">Status</th>
            <th style="${thStyle}">Date
            <th style="${thStyle}">Time</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.guests
      .map(guests => {
        
        // const timeA = Date.parse(`01/01/2000 ${guests.selectedTime}`);
        // const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));

        const date = new Date(guests.selectedDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        const formattedDate = date.toLocaleDateString('en-US', options);
      
        return `
          <tr>
            <td style="${tdStyle}">${guests.name}</td>
            <td style="${tdStyle}">${guests.phone}</td>
            <td style="${tdStyle}">${guests.status}</td>
            <td style="${tdStyle}">${formattedDate}</td>
            <td style="${tdStyle}">${guests.selectedTime}</td>
          </tr>
        `;
      })
      .join('');
  
      const printWindow = window.open('', 'Print', 'height=600,width=800');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Saint Anthony Dental Clinic - Patient List</title>
            <style>
              .header {
                display: flex;
                justify-content: space-between;
              }
              .date {
                text-align: right;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="date">${currentDate}</div>
            </div>
            ${logo}
            ${clinicName}
            ${address}
            ${lineSpacing}
            ${tableHead}
            ${printData}
            ${tableEnd}
          </body>
        </html>
    `);
    if (printWindow) {
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
    
    printWindow?.document.close();
  }

  private updateDateTime(): void {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    this.dateTime = currentDate.toLocaleString('en-US', options);
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.updateDateTime();
    }, 60000); // Update every minute (60000 milliseconds)
  }

  private stopTimer(): void {
    clearInterval(this.timer);
  }

  isTimeAvailable(hour: number, minute: string): boolean {
    const selectedDateValue = this.guestForm.get('selectedDate')?.value;
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

  isTimeAvailablePatient(hour: number, minute: string): boolean {
    const selectedDateValue = this.addPatientForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = `${hour}:${minute}`;
  
    if (this.patients && Array.isArray(this.patients)) {
      for (const patient of this.patients.filter((p)=> p.selectedDoctor === this.selectDoctor)) {
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

  hasConflict(): boolean {
    const selectedDateValue = this.guestForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = this.guestForm.get('selectedTime')?.value;
  
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

  hasConflictPatient(): boolean {
    const selectedDateValue = this.addPatientForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = this.addPatientForm.get('selectedTime')?.value;
  
    if (this.patients && Array.isArray(this.patients)) {
  
      for (const guest of this.patients) {
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

  showTimeTable(): void {
    this.showTable = true;
  }
  hideTimeTable(): void {
    this.showTable = false;
  }

  getAllGuests(): void {
    this.guestService.getAllGuests().subscribe(
      (data: Guest[]) => {
        this.guestSlot = data.filter((p)=> p.status === "Ongoing" || p.status === "Pending")
      }
    )
  }

  addPatient(): void {
    if(this.addPatientForm.valid) {
      this.patientService.createPatient(this.addPatientForm.value)
      .subscribe({
        next: (res => {
          this.toast.success({detail: "SUCCESS", summary: "Patient has been created.", duration: 3000});
          this.addPatientForm.reset();
          this.getOngoingPatients();
          const buttonRef = document.getElementById("closeAdd");
          buttonRef?.click();
        }),
        error: (err => {
          console.log('error')
        })
      })
    } else {
      console.log('Invalid');
      ValidateForm.validateFormFields(this.addPatientForm)
    }
  }

  getOngoingPatients(): void {
    this.patientService.getOngoingPatients().subscribe(
    (data: Patient[]) => {
      this.patients = data;
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  selectedServiceAddChanged(event: any) {
    this.addServiceCost = this.services.find(service => service.name === event.target.value);
  }

  addCost() {
    if(this.addServiceCost) {
      this.addServiceCost.cost = this.addServiceCost.cost || 0;
      this.addPatientForm.controls['cost'].setValue(this.addServiceCost.cost);
    }
  }

  getDoctors(): void {
    this.doctorService.getAllDoctors()
    .subscribe(doctors => this.doctors = doctors);
  }
}
