import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorLoggedComponent {
  username!: string;

  constructor(private route: ActivatedRoute,
    private toast: NgToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
  }

  logout(){
    this.router.navigate(['']);
    this.toast.warning({detail: "Logged Out", summary: "You have logged out", duration: 3000})
  }
}
