import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/_shared/models/doctor.model';
import { Guest } from 'src/app/_shared/models/guest.model';
import { Patient } from 'src/app/_shared/models/patient.model';
import { Service } from 'src/app/_shared/models/service.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';
import { GuestService } from 'src/app/_shared/services/guest.service';
import { PatientService } from 'src/app/_shared/services/patient.service';
import { ServiceService } from 'src/app/_shared/services/service.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  patients!: Patient[];
  todayPatients!: Patient[];
  ongoingPatients!: Patient[];
  totalPatients = 0;

  guests!: Guest[];
  todayGuests!: Guest[];
  ongoingGuests!: Guest[];
  totalGuest = 0;

  services!: Service[];
  totalServices = 0;

  doctors!: Doctor[];
  totalDoctors = 0;

  totalAppointments = 0;

  currentDate: Date = new Date();
  dateTime!: string;
  private timer: any;


  constructor(private patientService: PatientService,
    private guestService: GuestService,
    private doctorService: DoctorService,
    private serviceService: ServiceService
    ) {}

  ngOnInit() {
    this.getPatients();
    this.getBooks();
    this.getServices();
    this.getDoctors();
    this.getTodayPatients();
    this.getTodayBooks();
    this.updateDateTime();
    this.startTimer();
    this.getAppointments();
    this.getOngoingBooks();
    this.getOngoingPatients();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  getAllPatients() {
    this.patientService.getAllPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPatients(): void {
    this.patientService.getAllPatients().subscribe(
      (appointments) => {
        this.patients = appointments;
        this.totalPatients = Array.from(appointments).length;
      }
    );
  }

  getBooks(): void {
    this.guestService.getAllGuests().subscribe(
      (guests) => {
        this.guests = guests;
        this.totalGuest = Array.from(guests).length;
      }
    )
  }

  getServices(): void {
    this.serviceService.getAllServicess().subscribe(
      (services) => {
        this.services = services;
        this.totalServices = Array.from(services).length;
      }
    )
  }

  getDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
        this.totalDoctors = Array.from(doctors).length;
      }
    )
  }

  getTodayPatients(): void {
    this.patientService.getTodayPatients().subscribe(
      (patients) => {
        this.todayPatients = patients;
      }
    )
  }

  getTodayAppointments(): void {
    this.patientService.getTodayPatients().subscribe(
      (patients) => {
        this.todayPatients = patients;
      }
    )
  }

  getTodayBooks(): void {
    this.guestService.getTodayGuests().subscribe(
      (guests) => {
        this.todayGuests = guests;
      }
    )
  }

  getOngoingPatients(): void{
    this.patientService.getOngoingPatients().subscribe(
      (patients => {
        this.ongoingPatients = patients;
      })
    )
  }

  getOngoingBooks(): void{
    this.guestService.getOngoingGuests().subscribe(
      (patients => {
        this.ongoingGuests = patients;
      })
    )
  }

  getAppointments(): void {
    forkJoin([
      this.patientService.getOngoingPatients(),
      this.guestService.getOngoingGuests()
    ]).subscribe(([patients, guests]) => {
      // Handle the data from both services
      const patientsCount = Array.from(patients).length;
      const guestsCount = Array.from(guests).length;
      this.totalAppointments = patientsCount + guestsCount
    });
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

  printPatients(): void {
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
            <th style="${thStyle}">Service</th>
            <th style="${thStyle}">Doctor</th>
            <th style="${thStyle}">Date</th>
            <th style="${thStyle}">Time</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.todayPatients
      .map(patients => {
        const date = new Date(patients.selectedDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        const formattedDate = date.toLocaleDateString('en-US', options);
  
        return `
          <tr>
            <td style="${tdStyle}">${patients.name}</td>
            <td style="${tdStyle}">${patients.phone}</td>
            <td style="${tdStyle}">${patients.selectedService}</td>
            <td style="${tdStyle}">${patients.selectedDoctor}</td>
            <td style="${tdStyle}">${formattedDate}</td>
            <td style="${tdStyle}">${patients.selectedTime}</td>
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

  printGuests(): void {
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
            <th style="${thStyle}">Service</th>
            <th style="${thStyle}">Date</th>
            <th style="${thStyle}">Time</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.todayGuests
      .map(guests => {
        const date = new Date(guests.selectedDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        const formattedDate = date.toLocaleDateString('en-US', options);
  
        return `
          <tr>
            <td style="${tdStyle}">${guests.name}</td>
            <td style="${tdStyle}">${guests.phone}</td>
            <td style="${tdStyle}">${guests.service}</td>
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
  
  calculateAge(birthdate: Date): number {
    console.log('birthdate:', birthdate);
    const parsedDate = Date.parse(birthdate.toString());
    if (isNaN(parsedDate)) {
        console.log('Failed to parse date:', birthdate);
        return -1;
    }
    const today = new Date();
    const birthDate = new Date(parsedDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
}
