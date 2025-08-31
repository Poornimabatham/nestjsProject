import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  showErrorPopup = false;
  showSuccessPopup = false;
  errorMessage = '';
  successMessage = 'Login successful! Redirecting...';
  
  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.showErrorPopup = false;
    this.showSuccessPopup = false;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.userService.login(loginData).subscribe({
      next: (response: any) => {
        this.showSuccessPopup = true;
        this.isLoading = false;
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // Adjust the route as needed
        }, 1000);
      },
      error: (error: any) => {
        console.log('Login error:', error);
        
        // Handle 401 error with 'user not found' message
        if (error.status === 401) {
          if (error.error?.message === 'user not found' || error.error?.error === 'user not found') {
            this.errorMessage = 'No account found with this email. Redirecting to signup...';
            // Redirect to signup page after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/signup']);
            }, 2000);
          } else {
            // Show the error message from the backend if it exists
            this.errorMessage = error.error?.message || error.error?.error || 'Invalid email or password';
          }
        } else {
          // Handle other types of errors
          this.errorMessage = error.error?.message || error.message || 'An error occurred during login. Please try again.';
        }
        
        this.showErrorPopup = true;
        this.isLoading = false;
      }
    });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }
}
