import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(
    private authService: AuthService,
    public router: Router,
  ) { }

  logado() {
    return this.authService.loggedIn();
  }

  userName() {
    return sessionStorage.getItem('userName');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
}
