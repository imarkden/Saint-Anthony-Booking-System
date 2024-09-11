import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Guest } from 'src/app/_shared/models/guest.model';
import { Patient } from 'src/app/_shared/models/patient.model';
import { GuestService } from 'src/app/_shared/services/guest.service';
import { PatientService } from 'src/app/_shared/services/patient.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicePatientListModalComponent } from '../service-patient-list-modal/service-patient-list-modal.component';
import { ServiceBookListModalComponent } from '../service-book-list-modal/service-book-list-modal.component';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  patients: Patient[] = [];
  allPatientModal: Patient[] = [];
  ongoingPatientModal: Patient[] = [];
  successPatientModal: Patient[] = [];
  failPatientModal: Patient[] = [];
  cancelPatientModal: Patient[] = [];
  failCancelPatientModal: Patient[] = [];
  
  booking: Guest[] = [];
  allBookModal: Guest[] = [];
  ongoingBookModal: Guest[] = [];
  pendingBookModal: Guest[] = [];
  failBookModal: Guest[] = [];
  cancelBookModal: Guest[] = [];
  successBookModal: Guest[] = [];

  totalPatients: number = 0;
  successPatients: number = 0;
  failPatients: number = 0;
  activePatients: number = 0;
  cancelPatients: number = 0;
  lossAmount: number = 0;
  totalAmount: number = 0;
  ongoingAmount: number = 0;
  expectedAmount: number = 0;

  totalBooking: number = 0;
  successBooking: number = 0;
  failBooking: number = 0;
  pendingBooking: number = 0;
  cancelBooking: number = 0;
  ongoingBooking: number = 0;

  selectedBookYear: number = 2023;
  selectedBookMonth: number = 5;

  selectedYear: number = 2023;
  selectedMonth: number = 5;
  selectedStatus: string = 'Success'

  sortBy: string = 'date';

  dateTime!: string;
  private timer: any;
  
  isPatient = true;
  isBooking = false;

  years: number[] = [2024, 2023, 2022,]; // Add more years as needed
  months: { name: string, value: number }[] = [
    { name: 'All', value: 0},
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'Novermber', value: 11 },
    { name: 'December', value: 12 }
  ];

  constructor(private patientService: PatientService,
    private guestService: GuestService,
    private modalService: NgbModal) {}

  ngOnInit() {
    
    this.getAppointments();
    this.getBookings();
    this.updateDateTime();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  getSuccessPatients(): void {
    this.patientService.getSuccessPatients().pipe(
      map(patients => {
        this.successPatients = patients.length;
        this.totalAmount = patients.reduce((sum, patient) => sum + patient.totalAmount, 0);
      })
    ).subscribe();
  }

  getOngoingPatients(): void {
    this.patientService.getOngoingPatients().pipe(
      map(patients => {
        this.activePatients = patients.length;
      })
    ).subscribe();
  }

  getCancelPatients(): void {
    this.patientService.getCancelPatients().pipe(
      map(patients => {
        this.cancelPatients = patients.length;
      })
    ).subscribe();
  }

  getFailPatients(): void {
    this.patientService.getFailPatients().pipe(
      map(patients => {
        this.failPatients = patients.length;
      })
    ).subscribe();
  }

  getUnsuccessfulPatient(): void {
    this.patientService.getUnsuccessfulPatient().pipe(
      map(patients => {
        this.lossAmount = patients.reduce((sum, patient) => sum + patient.totalAmount, 0);
      })
    ).subscribe();
  }

  getAllPatients(): void {
    this.patientService.getAllPatients().pipe(
      map(patients => {
        this.totalPatients = patients.length;
      })
    ).subscribe();
  }

  getAppointments(): void {
    if (this.selectedYear) {
      if (this.selectedMonth == 0) {
        this.patientService.getAppointmentsByYear(this.selectedYear).subscribe(
          (appointments) => {
            this.patients = appointments;
            this.sortPatients();
            this.totalPatients = Array.from(appointments).length;
            this.successPatients = appointments.filter((p) => p.status === 'Success').length;
            this.activePatients = appointments.filter((p) => p.status === 'Ongoing').length;
            this.cancelPatients = appointments.filter((p) => p.status === 'Cancel').length;
            this.failPatients = appointments.filter((p) => p.status === 'Fail').length;
            const successAppointments = appointments.filter(appointment => appointment.status === 'Success');
            this.totalAmount = successAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            const failAppointments = appointments.filter(appointment => appointment.status === 'Fail' || appointment.status === 'Cancel');
            this.lossAmount = failAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            const ongoingAppointments = appointments.filter(appointment => appointment.status === 'Ongoing');
            this.ongoingAmount = ongoingAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            this.expectedAmount = appointments.reduce((sum, p) => sum + p.totalAmount, 0);

            this.allPatientModal = appointments;
            this.ongoingPatientModal = appointments.filter((p) => p.status === 'Ongoing');
            this.successPatientModal = appointments.filter((p) => p.status === 'Success');
            this.cancelPatientModal = appointments.filter((p) => p.status === 'Cancel');
            this.failPatientModal = appointments.filter((p) => p.status === 'Fail');
            this.failCancelPatientModal = appointments.filter((p) => p.status === 'Fail' || p.status === 'Cancel')
          }
        );
      } else {
        this.patientService.getAppointmentsByYearAndMonth(this.selectedYear, this.selectedMonth).subscribe(
          (appointments) => {
            this.patients = appointments;
            this.sortPatients();
            this.totalPatients = Array.from(appointments).length;
            this.successPatients = appointments.filter((p) => p.status === 'Success').length;
            this.activePatients = appointments.filter((p) => p.status === 'Ongoing').length;
            this.cancelPatients = appointments.filter((p) => p.status === 'Cancel').length;
            this.failPatients = appointments.filter((p) => p.status === 'Fail').length;
            const successAppointments = appointments.filter(appointment => appointment.status === 'Success');
            this.totalAmount = successAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            const failAppointments = appointments.filter(appointment => appointment.status === 'Fail' || appointment.status === 'Cancel');
            this.lossAmount = failAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            const ongoingAppointments = appointments.filter(appointment => appointment.status === 'Ongoing');
            this.ongoingAmount = ongoingAppointments.reduce((sum, p) => sum + p.totalAmount, 0);
            this.expectedAmount = appointments.reduce((sum, p) => sum + p.totalAmount, 0);

            this.allPatientModal = appointments;
            this.ongoingPatientModal = appointments.filter((p) => p.status === 'Ongoing');
            this.successPatientModal = appointments.filter((p) => p.status === 'Success');
            this.cancelPatientModal = appointments.filter((p) => p.status === 'Cancel');
            this.failPatientModal = appointments.filter((p) => p.status === 'Fail');
            this.failCancelPatientModal = appointments.filter((p) => p.status === 'Fail' || p.status === 'Cancel')
          }
        );
      }
    }
  }

  getBookings(): void {
    if (this.selectedYear) {
      if (this.selectedMonth == 0) {
        this.guestService.getGuestsByYear(this.selectedBookYear).subscribe(
          (bookings) => {
            this.booking = bookings;
            this.sortBookings();
            this.totalBooking = Array.from(bookings).length;
            this.successBooking = bookings.filter((p) => p.status === 'Success').length;
            this.ongoingBooking = bookings.filter((p) => p.status === 'Ongoing').length;
            this.cancelBooking = bookings.filter((p) => p.status === 'Cancel').length;
            this.failBooking = bookings.filter((p) => p.status === 'Fail').length;
            this.pendingBooking = bookings.filter((p) => p.status === 'Pending').length;

            this.allBookModal = bookings;
            this.ongoingBookModal = bookings.filter((p) => p.status === 'Ongoing');
            this.successBookModal = bookings.filter((p) => p.status === 'Success');
            this.cancelBookModal = bookings.filter((p) => p.status === 'Cancel');
            this.failBookModal = bookings.filter((p) => p.status === 'Fail');
            this.pendingBookModal = bookings.filter((p) => p.status === 'Pending');

          }
        );
      } else {
        this.guestService.getGuestsByYearAndMonth(this.selectedYear, this.selectedMonth).subscribe(
          (bookings) => {
            this.booking = bookings;
            this.sortBookings();
            this.totalBooking = Array.from(bookings).length;
            this.successBooking = bookings.filter((p) => p.status === 'Success').length;
            this.ongoingBooking = bookings.filter((p) => p.status === 'Ongoing').length;
            this.cancelBooking = bookings.filter((p) => p.status === 'Cancel').length;
            this.failBooking = bookings.filter((p) => p.status === 'Fail').length;
            this.pendingBooking = bookings.filter((p) => p.status === 'Pending').length;
            this.allBookModal = bookings;
            this.ongoingBookModal = bookings.filter((p) => p.status === 'Ongoing');
            this.successBookModal = bookings.filter((p) => p.status === 'Success');
            this.cancelBookModal = bookings.filter((p) => p.status === 'Cancel');
            this.failBookModal = bookings.filter((p) => p.status === 'Fail');
            this.pendingBookModal = bookings.filter((p) => p.status === 'Pending');
          }
        );
      }
    }
  }

  sortPatients(): void {
    this.patients.sort((a, b) => {
        const dateA = new Date(a.selectedDate);
        const dateB = new Date(b.selectedDate);
        const timeA = Date.parse(`01/01/2000 ${a.selectedTime}`);
        const timeB = Date.parse(`01/01/2000 ${b.selectedTime}`);
        const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));
        const dateTimeB = new Date(dateB.setHours(new Date(timeB).getHours(), new Date(timeB).getMinutes()));
        console.log(dateTimeA)
        return dateTimeA.getTime() - dateTimeB.getTime();
    });
  }

  sortBookings(): void {
    this.booking.sort((a, b) => {
        const dateA = new Date(a.selectedDate);
        const dateB = new Date(b.selectedDate);
        const timeA = Date.parse(`01/01/2000 ${a.selectedTime}`);
        const timeB = Date.parse(`01/01/2000 ${b.selectedTime}`);
        const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));
        const dateTimeB = new Date(dateB.setHours(new Date(timeB).getHours(), new Date(timeB).getMinutes()));
        console.log(dateTimeA)
        return dateTimeA.getTime() - dateTimeB.getTime();
    });
  }

  search(): void {
    if (this.selectedYear && this.selectedMonth) {
      this.patientService.getPatientsByYearAndMonthAndStatus(this.selectedYear, this.selectedMonth, this.selectedStatus)
        .subscribe(patients => this.patients = patients);
    }
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

    let date = '';
    if (this.selectedMonth === 0) {
      date = `${this.selectedYear} - All Months`;
    } else {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const selectedMonthName = monthNames[this.selectedMonth - 1];
      if (selectedMonthName) {
        date = `${this.selectedYear} - ${selectedMonthName}`;
      } else {
        date = `${this.selectedYear} - All Months`;
      }
    }

    const doctorCounts = this.getDoctorCounts();
    const serviceCounts = this.getServiceCounts();

    const logo = '<img src="./../../../assets/logo.png" width="150px" height="150px" style="display: block; margin: 0 auto; line-height: 1px">';
    const clinicName = '<h2 style="text-align: center; line-height: 1px">Saint Anthony Dental Clinic</h2>';
    const address = '<p style="text-align: center; line-height: 1px ">1 Ballecer, South Signal Village, Taguig, 1632 Metro Manila, Philippines</p>';
    const lineSpacing = '<br/><br/>';
  
    const tableStyle = 'border: 1px solid #dee2e6; border-collapse: collapse; width: 100%;';
    const thStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px; text-align: left; background-color: #f2f2f2;';
    const tdStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px;';

    const cardStyle = 'border: 1px solid #ddd; border-radius: 8px; background-color: #fff; padding: 5px;';
    const cardHeaderStyle = 'background-color: #f2f2f2; padding: 5px; border-bottom: 1px solid #ddd;';
    const cardTitleStyle = 'font-family: "Bebas Neue", sans-serif; font-size: 5px; margin: 0;';
    const cardBodyStyle = 'padding: 1rem;';
    const tableStyle2 = 'width: 100%;';

    const card = `
      <div style="${cardStyle} margin-top: 30px;">
      <div style="${cardHeaderStyle}">
        <p style="${cardTitleStyle}">PATIENTS REPORT</p>
      </div>
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Summary</th>
            <th style="${thStyle} width: 30%;">Count</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
            <tr>
              <td style="${tdStyle}"> Completed Patients</td>
              <td style="${tdStyle}">${this.successPatients}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Ongoing Patients</td>
              <td style="${tdStyle}">${this.activePatients}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Failed Patients</td>
              <td style="${tdStyle}">${this.failPatients}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Cancelled Patients</td>
              <td style="${tdStyle}">${this.cancelPatients}</td>
            </tr>
        </tbody>
      </table>
      <table style="${tableStyle} margin-top: 30px;">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Summary</th>
            <th style="${thStyle} width: 30%;">Amount</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
            <tr>
              <td style="${tdStyle}"> Total Earning</td>
              <td style="${tdStyle}">₱${this.totalAmount}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Expecting Earning from ongoing patients</td>
              <td style="${tdStyle}"> ₱${this.ongoingAmount}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Losses from failed and cancelled patients</td>
              <td style="${tdStyle}">₱${this.lossAmount}</td>
            </tr>
            <tr>
              <td style="${tdStyle}"> Totla sum from all patients (completed, ongoing and losses)</td>
              <td style="${tdStyle}">₱${this.expectedAmount}</td>
            </tr>
        </tbody>
      </table>
    </div>
    `;

    const serviceCountsTable = `
    <div style="${cardStyle} margin-top: 30px;">
      <div style="${cardHeaderStyle}">
        <p style="${cardTitleStyle}">PATIENTS COUNT PER SERVICE</p>
      </div>
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Service Name</th>
            <th style="${thStyle} width: 30%;">Count</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
          ${serviceCounts.map(service => `
            <tr>
              <td style="${tdStyle}">${service.name}</td>
              <td style="${tdStyle}">${service.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

    const doctorCountsTable = `
    <div style="${cardStyle} margin-top: 30px;">
      <div style="${cardHeaderStyle}">
        <p style="${cardTitleStyle}">PATIENTS PER DOCTOR COUNT</p>
      </div>
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Doctor</th>
            <th style="${thStyle}">Count</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
          ${doctorCounts.map(doctor => `
            <tr>
              <td style="${tdStyle}">${doctor.name}</td>
              <td style="${tdStyle}">${doctor.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
    const tableHead = `
    <div style="${cardStyle} margin-top: 30px;">
        <div style="${cardHeaderStyle}">
          <p style="${cardTitleStyle}">PATIENTS TABLE</p>
        </div>
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Name</th>
            <th style="${thStyle}">Phone</th>
            <th style="${thStyle}">Service</th>
            <th style="${thStyle}">Doctor</th>
            <th style="${thStyle}">Date</th>
            <th style="${thStyle}">Time</th>
            <th style="${thStyle}">Status</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    </div>
    `;
  
    const printData = this.patients
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
            <td style="${tdStyle}">${patients.status}</td>
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
              <div class="date">${date}</div>
            </div>
            ${logo}
            ${clinicName}
            ${address}
            ${lineSpacing}
            ${card}
            ${serviceCountsTable}
            ${doctorCountsTable}
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

    let date = '';
    if (this.selectedMonth === 0) {
      date = `${this.selectedYear} - All Months`;
    } else {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const selectedMonthName = monthNames[this.selectedMonth - 1];
      if (selectedMonthName) {
        date = `${this.selectedYear} - ${selectedMonthName}`;
      } else {
        date = `${this.selectedYear} - Invalid Month`;
      }
    }

    const serviceCounts = this.getServiceBookCounts();

    const logo = '<img src="./../../../assets/logo.png" width="150px" height="150px" style="display: block; margin: 0 auto; line-height: 1px">';
    const clinicName = '<h2 style="text-align: center; line-height: 1px">Saint Anthony Dental Clinic</h2>';
    const address = '<p style="text-align: center; line-height: 1px ">1 Ballecer, South Signal Village, Taguig, 1632 Metro Manila, Philippines</p>';
    const lineSpacing = '<br/><br/>';
  
    const tableStyle = 'border: 1px solid #dee2e6; border-collapse: collapse; width: 100%;';
    const thStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px; text-align: left; background-color: #f2f2f2;';
    const tdStyle = 'border: 1px solid #dee2e6; padding: 8px; font-size: 14px;';
  
    const cardStyle = 'border: 1px solid #ddd; border-radius: 8px; background-color: #fff; padding: 5px;';
    const cardHeaderStyle = 'background-color: #f2f2f2; padding: 5px; border-bottom: 1px solid #ddd;';
    const cardTitleStyle = 'font-family: "Bebas Neue", sans-serif; font-size: 5px; margin: 0;';

    const serviceCountsTable = `
    <div style="${cardStyle} margin-top: 30px;">
      <div style="${cardHeaderStyle}">
        <p style="${cardTitleStyle}">PATIENTS COUNT PER SERVICE</p>
      </div>
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Service Name</th>
            <th style="${thStyle} width: 30%;">Count</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
          ${serviceCounts.map(service => `
            <tr>
              <td style="${tdStyle}">${service.name}</td>
              <td style="${tdStyle}">${service.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

    const tableHead = `
      <table style="${tableStyle}">
        <thead>
          <tr style="font-size: 14px;">
            <th style="${thStyle}">Name</th>
            <th style="${thStyle}">Phone</th>
            <th style="${thStyle}">Service</th>
            <th style="${thStyle}">Time</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.booking
      .map(guests => {
        const dateA = new Date(guests.selectedDate);
        const timeA = Date.parse(`01/01/2000 ${guests.selectedTime}`);
        const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));
        const formattedDateTime = dateTimeA.toLocaleString('en-US');
  
        return `
          <tr>
            <td style="${tdStyle}">${guests.name}</td>
            <td style="${tdStyle}">${guests.phone}</td>
            <td style="${tdStyle}">${guests.service}</td>
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
              <div class="date">${date}</div>
            </div>
            ${logo}
            ${clinicName}
            ${address}
            ${lineSpacing}
            ${serviceCounts}
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

  getServiceCounts(): { name: string, count: number }[] {
    const serviceCounts: { name: string, count: number }[] = [];
    const serviceMap = new Map<string, number>();
  
    if (this.patients && this.patients.length > 0) {
      // Iterate over the patients and count the services
      this.patients.forEach(patient => {
        const serviceName = patient.selectedService;
        const count = serviceMap.get(serviceName)?.valueOf() ?? 0;
        serviceMap.set(serviceName, count + 1);
      });
    }
  
    // Convert the service map to an array of objects
    serviceMap.forEach((count, name) => {
      serviceCounts.push({ name, count });
    });
  
    return serviceCounts;
  }

  getDoctorCounts(): { name: string, count: number }[] {
    const doctorCounts: { name: string, count: number }[] = [];
    const doctorMap = new Map<string, number>();

    if (this.patients && this.patients.length > 0) {
      this.patients.forEach(patient => {
        const doctorName = patient.selectedDoctor;
        const count = doctorMap.get(doctorName)?.valueOf() ?? 0;
        doctorMap.set(doctorName, count + 1);
      })
    }

    doctorMap.forEach((count, name) => {
      doctorCounts.push({ name, count });
    });

    return doctorCounts;
  }

  getServiceBookCounts(): { name: string, count: number }[] {
    const serviceCounts: { name: string, count: number }[] = [];
    const serviceMap = new Map<string, number>();
  
    if (this.booking && this.booking.length > 0) {
      // Iterate over the patients and count the services
      this.booking.forEach(books => {
        const serviceName = books.service;
        const count = serviceMap.get(serviceName)?.valueOf() ?? 0;
        serviceMap.set(serviceName, count + 1);
      });
    }
  
    // Convert the service map to an array of objects
    serviceMap.forEach((count, name) => {
      serviceCounts.push({ name, count });
    });
  
    return serviceCounts;
  }
  
  getPatientsByService(serviceName: string): Patient[] {
    return this.patients.filter(patient => patient.selectedService === serviceName);
  }
  
  openPatientListModal(patients: Patient[]) {
    const modalRef = this.modalService.open(ServicePatientListModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.patients = patients;
  }

  getPatientsByDoctor(doctorName: string): Patient[] {
    return this.patients.filter(patient => patient.selectedDoctor === doctorName);
  }

  getBooksByService(serviceName: string): Guest[] {
    return this.booking.filter(guest => guest.service === serviceName);
  }
  
  openBookListModal(booking: Guest[]) {
    const modalRef = this.modalService.open(ServiceBookListModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.booking = booking;
  }

  isActivePatient() {
    this.isPatient = true;
    this.isBooking = false;
  }

  isActiveBooking() {
    this.isPatient = false;
    this.isBooking = true;
  }
}
