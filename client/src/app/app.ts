import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers: [UserService],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App {
  title = 'my-app';
}
