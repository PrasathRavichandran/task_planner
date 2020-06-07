import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onClickLogin(email, password) {
    this.authService.onLogin(email.value, password.value).subscribe(res => {
      if (res) this.router.navigate(['/']);
    });
  }

}
