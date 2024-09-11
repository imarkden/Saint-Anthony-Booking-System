import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';
import { minimumAgeValidator } from 'src/app/_shared/helpers/age-validator';
import { phoneValidator } from 'src/app/_shared/helpers/phone.validator';
import { Doctor } from 'src/app/_shared/models/doctor.model';
import { Patient } from 'src/app/_shared/models/patient.model';
import { Service } from 'src/app/_shared/models/service.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';
import { PatientService } from 'src/app/_shared/services/patient.service';
import { ServiceService } from 'src/app/_shared/services/service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedDoctor: Doctor = {} as Doctor;
  editDoctorForm!: FormGroup;

  selectedPatient: Patient = {} as Patient;
  patientForm!: FormGroup;
  editPatientForm!: FormGroup;

  selectedDate: Date = new Date();

  services!: Service[];

  username!: string;
  name!: string;
  doctors!: Doctor[];

  selectService = ''
  serviceCost: any;
  addServiceCost: any;

  patients!: Patient[];
  todays!: Patient[];
  fails!: Patient[];
  success!: Patient[];
  ongoings!: Patient[];
  todayPatients = 0;
  ongoingPatients = 0;
  failPatients = 0;
  successPatients = 0;
  totalPatients = 0;

  totalAppointments = 0;

  currentDate: Date = new Date();
  dateTime!: string;
  private timer: any;
  

  sortBy: string = 'date';
  hours = Array.from({length: 10}, (_, i) => i + 9);
  minutes = ['00', '15', '30', '45'];
  minDate!: Date;
  minDateString!: string;

  showTable = false;
  displayDate: string = '';

  constructor(private route: ActivatedRoute,
    private patientService: PatientService,
    private serviceService: ServiceService,
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private toast: NgToastService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.username = params['username'];
    });
    this.getPatients();
    this.getDoctorName();
    this.getFailPatients();
    this.getSuccessPatients();
    this.getTodayPatients();
    this.updateDateTime();
    this.startTimer();
    // this.getAppointments();
    this.getOngoingPatients();
    this.getServices();

    this.editDoctorForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      birthdate: ['', [Validators.required, minimumAgeValidator(18)]],
      phone: ['', [Validators.required, phoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.patientForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      phone: ['', [Validators.required, phoneValidator]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      selectedService: ['', Validators.required],
      selectedDoctor: ['', Validators.required],
      selectedDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
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

  getServices(): void {
    this.serviceService.getAllServicess()
      .subscribe(services => this.services = services);
  }

  getDoctorName(): void {
    this.doctorService.getDoctorByUsername(this.username).subscribe(
      (doctor: Doctor) => {
        this.doctors = [doctor];
        this.name = doctor.name;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPatients(): void {
    this.patientService.getAllPatients().subscribe(
      (appointments) => {
        this.patients = appointments.filter((p) => p.selectedDoctor === this.name);
        this.totalPatients = appointments.filter((p) => p.selectedDoctor === this.name).length;
      }
    );
  }       
  
  getTodayPatients(): void {
    this.patientService.getTodayPatients().subscribe(
      (patients) => {
        this.todayPatients = patients.filter((p) => p.selectedDoctor === this.name).length;
        this.todays = patients.filter((p) => p.selectedDoctor === this.name);
      }
    )
  }

  getOngoingPatients(): void{
    this.patientService.getOngoingPatients().subscribe(
      (patients => {
        this.ongoingPatients = patients.filter((p) => p.selectedDoctor === this.name).length;
        this.ongoings = patients.filter((p) => p.selectedDoctor === this.name)
      })
    )
  }

  getFailPatients(): void {
    forkJoin([
      this.patientService.getFailPatients(),
      this.patientService.getCancelPatients()
    ]).subscribe(([patients]) => {
      // Handle the data from both services
      this.failPatients = patients.filter((p) => p.selectedDoctor === this.name).length;
      this.fails = patients.filter((p) => p.selectedDoctor === this.name)
    });
  }

  getSuccessPatients(): void {
    this.patientService.getSuccessPatients().subscribe(
      (patients) => {
        this.success = patients.filter((p) => p.selectedDoctor === this.name);
        this.successPatients = patients.filter((p) => p.selectedDoctor === this.name).length;
      }
    )
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
  
    const printData = this.todays
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

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    const selectedDate = new Date(doctor.birthdate);
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    this.editDoctorForm.setValue({
      id: doctor.id,
      name: doctor.name,
      birthdate: formattedDate,
      phone: doctor.phone,
      email: doctor.email,
      gender: doctor.gender,
      username: doctor.username,
      password: doctor.password
    });
  }

  editDoctor(): void {
    if (this.editDoctorForm.valid) {
      const serviceData = this.editDoctorForm.value;
      const serviceId = this.selectedDoctor.id;
      this.doctorService.updateDoctor(serviceId, serviceData).subscribe(
        response => {
          console.log('Service updated successful:', response);
          // close the modal after successful update
          this.toast.warning({detail: "SUCCESS", summary: "Doctor successfully changed.", duration: 3000})
          this.editDoctorForm.reset();
          this.getDoctorName();
          const buttonRef = document.getElementById("closeEdit");
          buttonRef?.click();
        },
        error => {
          console.error('Error updating service:', error);
          // handle the error as appropriate
        }
      );
    } else {
      console.error('Invalid form data');
      // handle the error as appropriate
    }
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    const selectedDate = new Date(patient.selectedDate);
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    this.patientForm.patchValue({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      age: patient.age,
      selectedService: patient.selectedService,
      selectedDoctor: patient.selectedDoctor,
      selectedTime: patient.selectedTime,
      selectedDate: formattedDate,
      duration: patient.duration,
      cost: patient.cost,
      additionalCost: patient.additionalCost,
      note: patient.note
    });
  }

  setStatusModal(patientId: number) {
    this.selectedPatient.id = patientId;
  }

  deletePatient(id: number): void {
    if(confirm('Are you sure you want to delete this service?')) {
      this.patientService.deletePatient(id).subscribe(
        (data: any) => {
          this.getTodayPatients();
          this.toast.warning({detail: "WARNING", summary: "One service has been removed.", duration: 3000})
        },
        (error: any) => {
          console.log(error)
        }
      )
    }
  }

  editPatient(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      const patientId = this.selectedPatient.id;

      this.patientService.updatePatient(patientId, patientData).subscribe(
        response => {
          console.log('Patient updated successful', response);
          this.toast.warning({detail: "SUCCESS", summary: "Patient successfully changed.", duration: 3000});
          this.patientForm.reset();
          this.getTodayPatients();

          const buttonRef = document.getElementById("closeEdit");
          buttonRef?.click();
        },
        error => {
          console.log("Error updating the patient:", error);
        }
      );
    } else {
      console.log("invalid form data", this.patientForm);
    }
  }

  selectedServiceChanged(event: any) {
    this.serviceCost = this.services.find(service => service.name === event.target.value);
  }

  updateCost() {
    if (this.serviceCost) {
      this.serviceCost.cost = this.serviceCost.cost || 0;
      this.patientForm.controls['cost'].setValue(this.serviceCost.cost);
    }
  }

  hasConflictEdit(): boolean {
    const selectedDateValue = this.patientForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = this.patientForm.get('selectedTime')?.value;
  
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

  isTimeAvailableEdit(hour: number, minute: string): boolean {
    const selectedDateValue = this.patientForm.get('selectedDate')?.value;
    const selectedDate = new Date(selectedDateValue);
    const selectedTime = `${hour}:${minute}`;
  
    if (this.patients && Array.isArray(this.patients)) {
      for (const patient of this.patients.filter((p)=> p.selectedDoctor === this.name)) {
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

  updatePatientStatusSuccess() {
    if (this.selectedPatient) {
      console.log(this.selectedPatient.id)
      this.patientService.updatePatientStatusSuccess(this.selectedPatient.id)
        .subscribe(() => {
          const buttonRef = document.getElementById("closeModal");
          buttonRef?.click();
          // handle success
        }, (error) => {
          // handle error
        });
    }
  }

  updatePatientStatusCancel() {
    if (this.selectedPatient) {
      console.log(this.selectedPatient.id)
      this.patientService.updatePatientStatusCancel(this.selectedPatient.id)
        .subscribe(() => {
          const buttonRef = document.getElementById("closeModal");
          buttonRef?.click();
          // handle success
        }, (error) => {
          // handle error
        });
    }
  }

}
