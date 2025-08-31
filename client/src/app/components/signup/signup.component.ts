import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService, SignupData } from '../../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  isLoading = false;
  showErrorPopup = false;
  showSuccessPopup = false;
  errorMessage = '';
  successMessage = 'Signup successful! Redirecting to login...';
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }

  // Custom validator to check if passwords match
  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const controlToMatch = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (controlToMatch.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  get f() { return this.signupForm.controls as { [key: string]: AbstractControl }; }

  onSubmit() {
    this.submitted = true;
    this.showErrorPopup = false;
    
    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const userData: SignupData = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.userService.signup(userData).subscribe({
      next: (response: any) => {
        this.showSuccessPopup = true;
        this.isLoading = false;
        // The popup will be shown, and the closeSuccessPopup method will handle the navigation
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'An error occurred during signup';
        this.showErrorPopup = true;
        this.isLoading = false;
      }
    });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }
}
