import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../../_auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navToggle: Boolean = false;

  constructor(
    private authService: AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);

  }

  toggleNav() {
    this.navToggle  = !this.navToggle;
  }

}
