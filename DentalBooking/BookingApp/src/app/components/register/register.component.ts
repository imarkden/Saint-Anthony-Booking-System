import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_shared/services/auth.service';
import ValidateForm from '../../_shared/helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  isPasswordVisible = false;

  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
    ) {

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  onclicktoggle() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if(this.registerForm.valid) {

      this.auth.register(this.registerForm.value)
      .subscribe({
        next: (res=> {
          this.toast.success({detail: "SUCCESS", summary: res.message, duration: 3000})
          this.registerForm.reset();
          this.router.navigate(['login'])
        }),
        error: (err => {
          alert(err?.error.message);
          this.toast.error({detail: "ERROR", summary: "Registration failed.", duration: 3000})
        })
      })

    } else {
      console.log('Invalid.')
      ValidateForm.validateFormFields(this.registerForm)
    }
  }
}
