import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { Service } from 'src/app/_shared/models/service.model';
import { ServiceService } from 'src/app/_shared/services/service.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {
services: Service[] = [];
selectedService: Service = {} as Service;
serviceForm!: FormGroup;
editServiceForm!: FormGroup;

dateTime!: string;
  private timer: any;

sortBy: string = 'id';

constructor(private servicesService: ServiceService,
  private formBuilder: FormBuilder,
  private toast: NgToastService) {}

  ngOnInit(): void {
    this.getServices();
    this.updateDateTime();
    this.startTimer();

    this.serviceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      cost: ['', [Validators.required, Validators.pattern('^[0-9.]+$')]],
      description: ['']
    })

    this.editServiceForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      cost: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: ['']
    })
    
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  getServices(): void {
    this.servicesService.getAllServicess().subscribe(
      (data: Service[]) => {
        this.services = data;
        this.sortServices();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesService.deleteService(id).subscribe(
        (data: any) => {
          this.getServices();
          this.toast.warning({detail: "WARNING", summary: "Service has been removed.", duration: 3000})
        },
        (error: any) => {
          console.log(error)
        }
      );
    }
  }

  sortServices(): void {
    this.services.sort((a, b) => {
      if (this.sortBy === 'id') {
        return a.id - b.id;
      } else if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.sortBy === 'cost') {
        return a.cost - b.cost;
      } else {
        return 0;
      }
    });
  }

  addService(): void {
    if(this.serviceForm.valid) {
      this.servicesService.createService(this.serviceForm.value).subscribe({
        next: (res => {
          this.toast.success({detail: "SUCCESS", summary: "New Service Added.", duration: 3000});
          this.serviceForm.reset();
          this.getServices();
          const buttonRef = document.getElementById("closeAdd");
          buttonRef?.click();
        }),
        error: (err => {
          alert(err?.err.message);
        })
      })
    } else {
      console.log('Invalid')
      ValidateForm.validateFormFields(this.serviceForm)
    }
  }

  editService(): void {
    if (this.editServiceForm.valid) {
      const serviceData = this.editServiceForm.value;
      const serviceId = this.selectedService.id;
      this.servicesService.updateService(serviceId, serviceData).subscribe(
        response => {
          console.log('Service updated successful: ',response);
          this.toast.warning({detail: "SUCCESS", summary: "Service successfully changed.", duration: 3000})
          this.editServiceForm.reset();
          this.getServices();
          const buttonRef = document.getElementById("closeEdit");
          buttonRef?.click();
        },
        error => {
          console.error('Error updating service: ', error);
        }
      );
    } else {
      console.error("Invalid form data");
    }
  }

  selectService(service: Service): void {
    this.selectedService = service;
    this.editServiceForm.setValue({
      id: service.id,
      name: service.name,
      cost: service.cost,
      description: service.description
    });
  }

  clearModal() {
    this.serviceForm.reset();
    this.editServiceForm.reset();
  }

  printList(): void {
    this.sortServices();
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
            <th style="${thStyle}">Service Name</th>
            <th style="${thStyle}">Base Amount(₱)</th>
            <th style="${thStyle}">Note</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;">
    `;
  
    const tableEnd = `
        </tbody>
      </table>
    `;
  
    const printData = this.services
      .map(services => {
  
        return `
          <tr>
            <td style="${tdStyle}">${services.name}</td>
            <td style="${tdStyle}">${services.cost}</td>
            <td style="${tdStyle}">${services.description}</td>
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