import { AbstractControl, ValidationErrors } from "@angular/forms";

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^(\+63)[0-9]{10}$/;
    const phone = control.value;
    if (phoneRegex.test(phone)) {
      return null;
    } else {
      return { phoneInvalid: true };
    }
  }
  