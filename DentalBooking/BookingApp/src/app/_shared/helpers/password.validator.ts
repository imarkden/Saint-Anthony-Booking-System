import { Validators, FormGroup, FormControl } from '@angular/forms';

function passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value;
  
    // Check if the value contains at least one number, one uppercase letter, and is at least 8 characters long
    const hasNumber = /[0-9]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasValidLength = value.length >= 8;
  
    if (!hasNumber || !hasUppercase || !hasValidLength) {
      return { 'invalidPassword': true };
    }
  
    return null;
  }
  