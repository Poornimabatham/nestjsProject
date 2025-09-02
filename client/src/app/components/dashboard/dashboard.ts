import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  implements OnInit {
  products: any[] = [];

  constructor(private productService: UserService) {}
searchText: string = '';  // 👈 two-way bind to input box

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
}
