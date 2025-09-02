import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';   // 👈 Import for ngModel

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  welcomeMessage = 'Welcome to your Dashboard!';
  users: any[] = [];       // All users fetched from backend
  filteredUsers: any[] = []; // For search results
  searchTerm: string = '';  // Bind to search input

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized');

    this.userService.getProducts().subscribe({
      next: (data) => {
        console.log('Fetched users:', data);
        this.users = data;
        this.filteredUsers = data;  // 👈 Initially show all users
        if (this.users.length > 0) {
          this.welcomeMessage = `Welcome ${this.users[0].name}!`;
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

 onSearch() {
  this.userService.getProducts(this.searchTerm).subscribe({
    next: (data) => {
      this.filteredUsers = data; // results from backend
    },
    error: (err) => {
      console.error('Search failed:', err);
    }
  });
}


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
