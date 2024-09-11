import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minimumAgeValidator(minimumAge: number): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthday = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthday.getFullYear();
  
      birthday.setFullYear(today.getFullYear());
      if (today < birthday) {
        age--;
      }
  
      return age >= minimumAge ? null : { minimumAge: { requiredAge: minimumAge, actualAge: age } };
    };
  }
  