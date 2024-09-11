import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { minimumAgeValidator } from 'src/app/_shared/helpers/age-validator';
import { phoneValidator } from 'src/app/_shared/helpers/phone.validator';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { Doctor } from 'src/app/_shared/models/doctor.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';



@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent {
  doctors: Doctor[] = [];
  selectedDoctor: Doctor = {} as Doctor;
  doctorForm!: FormGroup;
  editDoctorForm!: FormGroup;

  dateTime!: string;
  private timer: any;

  sortBy: string = 'id';
  maxDate!: string;

  constructor(private doctorService: DoctorService, 
    private formBuilder: FormBuilder,
    private toast: NgToastService) { }

  ngOnInit(): void {
    this.getDoctors();
    this.setMaxDate();
    this.updateDateTime();
    this.startTimer();
    

    this.doctorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      birthdate: ['', [Validators.required, minimumAgeValidator(18)]],
      phone: ['', [Validators.required, phoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
      
    });

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

  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  getDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(
      (data: Doctor[]) => {
        this.doctors = data;
        this.sortDoctors();
        console.log(data)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe(
        (data: any) => {
          this.getDoctors();
          this.toast.warning({detail: "WARNING", summary: "One doctor has been removed.", duration: 3000})

        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  sortDoctors(): void {
    this.doctors.sort((a, b) => {
      if (this.sortBy === 'id') {
        return a.id - b.id;
      } else if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });
  }  

  addDoctor(): void {
    if(this.doctorForm.valid) {
      this.doctorService.createDoctor(this.doctorForm.value)
      .subscribe({
        next: (res => {
          this.toast.success({detail: "SUCCESS", summary: "New Doctor Added.", duration: 3000})
          this.doctorForm.reset();
          this.getDoctors();
          const buttonRef = document.getElementById("closeAdd");
          buttonRef?.click();
        }),
        error: (err => {
          alert(err?.error.message);
        })
      })
    } else {
      console.log('Invalid')
      ValidateForm.validateFormFields(this.doctorForm)
    }
  }

  // Edit existing doctor
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
          this.getDoctors();
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

  clearModal() {
    this.doctorForm.reset();
    this.editDoctorForm.reset();
  }

  setMaxDate(): void {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();

    // Add leading zeros to month and day if needed
    month = month.length < 2 ? `0${month}` : month;
    day = day.length < 2 ? `0${day}` : day;

    this.maxDate = `${year}-${month}-${day}`;
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


  formatDate(dateString: string): string {
    const date = new Date(dateString.slice(0, 19));
    return date.toLocaleDateString();
  }
  
  printList(): void {
    this.sortDoctors();
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
            <th style="${thStyle}">Birth Date</th>
            <th style="${thStyle}">Phone</th>
            <th style="${thStyle}">Email</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.doctors
    .map(doctor => {
      const formattedBirthDate = new Date(doctor.birthdate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      return `
        <tr>
          <td style="${tdStyle}">${doctor.name}</td>
          <td style="${tdStyle}">${formattedBirthDate}</td>
          <td style="${tdStyle}">${doctor.phone}</td>
          <td style="${tdStyle}">${doctor.email}</td>
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
}