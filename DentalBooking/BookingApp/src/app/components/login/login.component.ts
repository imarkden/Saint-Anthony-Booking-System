import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_shared/services/auth.service';
import ValidateForm from '../../_shared/helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../_shared/services/user-store.service';
import { ResetPasswordService } from '../../_shared/services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
  resetComplete = false;

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"

  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  loginForm!: FormGroup;
  resetForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    const passwordPattern = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/;

    this.resetForm = this.formBuilder.group({
      username: ['', Validators.required],
      otp: ['', Validators.required],
      password: new FormControl('', [Validators.required, Validators.pattern(passwordPattern)]),
    })
  }

  showPassword() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res) => {

          this.toast.success({detail: "SUCCESS", summary: "Login successful", duration: 3000 })
          this.loginForm.reset();
          // const tokenPayload = this.auth.decodeToken();
          // this.userStore.setFullNameFromStore(tokenPayload.name);
          // this.userStore.setRoleFromStore(tokenPayload.role);
          this.auth.setToken(res.accessToken);
          this.auth.setRefreshToken(res.refreshToken);
          this.router.navigate(['admin/dashboard'])
        },
        error: () => {
          this.toast.error({detail: "ERROR", summary: "Something went wrong.", duration: 3000})
        }
      });
  } else {
    ValidateForm.validateFormFields(this.loginForm);
  }
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);

      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Password changed', duration: 3000});
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
        },

        error: (err) => {
          this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000})
        }
      })
    }
  }

  sendResetRequest(): void {
    const baseUrl: string = "http://imarkden-001-site1.itempurl.com/api/";
    const url = `${baseUrl}admin/reset-password?username=${this.resetForm.get('username')?.value}`;
    this.auth.resetPassword(url).subscribe(
      () => {
        this.resetComplete = true;
      },
      (error) => {
        console.error('Error sending reset request:', error);
      }
    );
  }

  resetPassword(): void {
    if (this.resetForm.valid) {
      const username = this.resetForm.get('username')?.value;
      const newPassword = this.resetForm.get('password')?.value;
      const otp = this.resetForm.get('otp')?.value;

      this.auth.verifyOTPAndResetPassword(username, otp, newPassword).subscribe(
        () => {
          console.log('Password reset successful');
          this.toast.success({ detail: "SUCCESS", summary: "Password reset successful", duration: 3000 });
        },
        (error) => {
          console.error('Error resetting password:', error);
          this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
        }
      );
    }
  }

//https://www.youtube.com/watch?v=ApSERLzbA9g&list=PLc2Ziv7051bZhBeJlJaqq5lrQuVmBJL6A&index=3
}
