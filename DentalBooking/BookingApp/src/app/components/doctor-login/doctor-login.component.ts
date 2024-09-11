import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/_shared/helpers/validateForm';
import { LoginModel } from 'src/app/_shared/models/login.model';
import { DoctorService } from 'src/app/_shared/services/doctor.service';

@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.scss']
})
export class DoctorLoginComponent {

  loginForm!: FormGroup;

  constructor(private doctorService: DoctorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: NgToastService){}

    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

  login(): void {
    if(this.loginForm.valid) {
        this.doctorService.login(this.loginForm.value).subscribe({
        next: (doctor) => {
          this.toast.success({detail: "SUCCESS", summary: "Login successful", duration: 3000 })
          this.loginForm.reset();
          this.router.navigate(['doctor', doctor.username ],  { queryParams: { username: doctor.username } });
        },
        error: () => {
          this.toast.error({detail: "ERROR", summary: "Something went wrong.", duration: 3000})
        }
        });
    } else {
      ValidateForm.validateFormFields(this.loginForm);
    }
  }
}
