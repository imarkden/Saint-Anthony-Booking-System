import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { phoneValidator } from 'src/app/_shared/helpers/phone.validator';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { Doctor } from 'src/app/_shared/models/doctor.model';
import { Patient } from 'src/app/_shared/models/patient.model';
import { Service } from 'src/app/_shared/models/service.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';
import { PatientService } from 'src/app/_shared/services/patient.service';
import { ServiceService } from 'src/app/_shared/services/service.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent {
  username!: string;
  name!: string;
  doctors!: Doctor[];
    
    

    patients!: Patient[];
    selectedPatient: Patient = {} as Patient;
    patientForm!: FormGroup;
    addPatientForm!: FormGroup;
    editPatientForm!: FormGroup;
    services!: Service[];
  
    selectedDate: Date = new Date();
    selectedTime: string = "";
    selectService = ''
    selectDoctor = ''
    serviceCost: any;
    addServiceCost: any;
  
    sortBy: string = 'date';
    hours = Array.from({length: 10}, (_, i) => i + 9);
    minutes = ['00', '15', '30', '45'];
    minDate!: Date;
    currentDate!: Date;
    minDateString!: string;
  
    displayDate: string = '';
    dateTime!: string;
    private timer: any;
    showTable: boolean = false;
    disabledTimes: string[] = [];
  
    isDisabled = false;
    isOngoing = false;
    isToday = true;
    isHistory = false;
  
    constructor(private route: ActivatedRoute,
      private patientService: PatientService,
      private formBuilder: FormBuilder,
      private toast: NgToastService,
      private serviceService: ServiceService,
      private doctorService: DoctorService,
      private location: Location) {}
  
    ngOnInit(): void {
      this.route.queryParams.subscribe((params: Params) => {
        this.username = params['username'];
        // Perform any other necessary actions with the username
      });

      this.getDoctorName();
      this.getTodayPatients();
      this.getServices();
      this.updateDateTime();
      this.startTimer();
      
  
      this.currentDate = new Date();
      this.minDate = new Date(this.currentDate.getTime());
      const year = this.minDate.getFullYear();
      const month = String(this.minDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.minDate.getDate()).padStart(2, '0');
      this.minDateString = `${year}-${month}-${day}`;
  
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
  
      this.addPatientForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ\\s]+$')]],
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
  
    isEditDisabled(patient: Patient): boolean {
      return patient.status === 'Fail' || patient.status === 'Cancel' || patient.status === 'Success';
    }
    
    getOngoingPatients(): void {
      this.patientService.getOngoingPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data.filter((p)=> p.selectedDoctor === this.name);
        this.sortPatients();
      },
      (error: any) => {
        console.log(error);
      }
      )
    }
  
    getPendingPatients(): void {
      this.patientService.getPendingPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data.filter((p)=> p.selectedDoctor === this.name);
        this.sortPatients();
      },
      (error: any) => {
        console.log(error);
      }
      )
    }
  
    getTodayPatients(): void {
      this.patientService.getTodayPatients().subscribe(
        (data: Patient[] | any) => {
          if (Array.isArray(data)) {
            this.patients = data.filter((p)=> p.selectedDoctor === this.name);
          } else {
            console.log('Response data is not an array:', data);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
    getFailPatients(): void {
      this.patientService.getFailPatients().subscribe(
        (data: Patient[] | any) => {
          if (Array.isArray(data)) {
            this.patients = data.filter((p)=> p.selectedDoctor === this.name);
          } else {
            console.log('Response data is not an array:', data);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
    getCancelPatients(): void {
      this.patientService.getCancelPatients().subscribe(
        (data: Patient[] | any) => {
          if (Array.isArray(data)) {
            this.patients = data.filter((p)=> p.selectedDoctor === this.name);
          } else {
            console.log('Response data is not an array:', data);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
    getSuccessPatients(): void {
      this.patientService.getSuccessPatients().subscribe(
        (data: Patient[] | any) => {
          if (Array.isArray(data)) {
            this.patients = data.filter((p)=> p.selectedDoctor === this.name);
          } else {
            console.log('Response data is not an array:', data);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
  
    getPatientsHistory(): void {
      this.patientService.getPatientsHistory().subscribe(
        (data: Patient[] | any) => {
          if (Array.isArray(data)) {
            this.patients = data.filter((p)=> p.selectedDoctor === this.name);
          } else {
            console.log('Response data is not an array:', data);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
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
  
    editPatient(): void {
      if (this.patientForm.valid) {
        const patientData = this.patientForm.value;
        const patientId = this.selectedPatient.id;
  
        this.patientService.updatePatient(patientId, patientData).subscribe(
          response => {
            console.log('Patient updated successful', response);
            this.toast.warning({detail: "SUCCESS", summary: "Patient successfully changed.", duration: 3000});
            this.patientForm.reset();
            this.getPendingPatients();
            this.getServices();
            this.getOngoingPatients();
            this.clearModal();
  
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
    
  
    clearModal() {
      this.patientForm.reset();
      this.refreshComponent();
    }
  
    sortPatients(): void {
      this.patients.sort((a, b) => {
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
  
    deletePatient(id: number): void {
      if(confirm('Are you sure you want to delete this service?')) {
        this.patientService.deletePatient(id).subscribe(
          (data: any) => {
            this.getOngoingPatients();
            this.getPendingPatients();
            this.toast.warning({detail: "WARNING", summary: "One service has been removed.", duration: 3000})
          },
          (error: any) => {
            console.log(error)
          }
        )
      }
    }
  
    isTimeDisabled(time: string): boolean {
      // Check if the time slot is disabled
      return this.disabledTimes.includes(time);
    }
  
    hasConflict(): boolean {
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
      const date = this.patientForm.get('selectedDate')?.value;
      return regex.test(date);
    }
    
    refreshComponent() {
      this.location.replaceState(this.location.path(true));
      window.location.reload();
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
    
    setStatusModal(patientId: number) {
      this.selectedPatient.id = patientId;
    }
  
    closeModal() {
      if(this.isOngoing == true) {
        this.getOngoingPatients();
      } else if(this.isToday == true) {
        this.getTodayPatients();
      } else if(this.isHistory == true) {
        this.getPatientsHistory();
      }
    }
  
    isActiveOngoing(): void {
      this.isOngoing = true;
      this.isToday = false;
      this.isHistory = false;
      // your code here
    }
  
  
    isActiveToday(): void {
      this.isToday = true;
      this.isOngoing = false;
      this.isHistory = false;
      // your code here
    }
  
    isActiveHistory(): void {
      this.isHistory = true;
      this.isToday = false;
      this.isOngoing = false;
    }
  
    printList(): void {
      this.sortPatients();
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
              <th style="${thStyle}">Time</th>
            </tr>
          </thead>
          <tbody style="font-size: 14px;">
      `;
    
      const tableEnd = `
          </tbody>
        </table>
      `;
    
      const printData = this.patients
        .map(patients => {
          const dateA = new Date(patients.selectedDate);
          const timeA = Date.parse(`01/01/2000 ${patients.selectedTime}`);
          const dateTimeA = new Date(dateA.setHours(new Date(timeA).getHours(), new Date(timeA).getMinutes()));
          const formattedDateTime = dateTimeA.toLocaleString('en-US');
    
          return `
            <tr>
              <td style="${tdStyle}">${patients.name}</td>
              <td style="${tdStyle}">${patients.phone}</td>
              <td style="${tdStyle}">${patients.selectedService}</td>
              <td style="${tdStyle}">${patients.selectedDoctor}</td>
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
  
    selectedServiceChanged(event: any) {
      this.serviceCost = this.services.find(service => service.name === event.target.value);
    }
  
    updateCost() {
      if (this.serviceCost) {
        this.serviceCost.cost = this.serviceCost.cost || 0;
        this.patientForm.controls['cost'].setValue(this.serviceCost.cost);
      }
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
      const selectedDateValue = this.addPatientForm.get('selectedDate')?.value;
      const selectedDate = new Date(selectedDateValue);
      const selectedTime = `${hour}:${minute}`;
    
      if (this.patients && Array.isArray(this.patients)) {
        for (const patient of this.patients) {
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
  
    isTimeAvailableEdit(hour: number, minute: string): boolean {
      const selectedDateValue = this.patientForm.get('selectedDate')?.value;
      const selectedDate = new Date(selectedDateValue);
      const selectedTime = `${hour}:${minute}`;
    
      if (this.patients && Array.isArray(this.patients)) {
        for (const patient of this.patients) {
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
  
    showTimeTable(): void {
      this.showTable = true;
    }
    hideTimeTable(): void {
      this.showTable = false;
    }
  
  }