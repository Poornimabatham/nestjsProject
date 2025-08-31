import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  welcomeMessage = 'Welcome to your Dashboard!';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  logout() {
    // Call your auth service logout method if you have one
    // For now, just clear local storage and redirect to login
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
