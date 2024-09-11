import { Component } from '@angular/core';
import { Service } from 'src/app/_shared/models/service.model';
import { ServiceService } from 'src/app/_shared/services/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  services!: Service[];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(){
    this.getAllServices();
  }

  getAllServices(): void {
    this.serviceService.getAllServicess().subscribe((services: Service[]) => {
      this.services = services;
    }, error => {
      console.log('Error fetching guests:', error);
    });
  }

}
