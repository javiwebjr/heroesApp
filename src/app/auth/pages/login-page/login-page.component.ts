import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(private authService: AuthServiceService,
    private router: Router
  ){}

  onLogin():void{
    this.authService.login('test@gmail.com', '123456')
      .subscribe(user => {
        this.router.navigate(['/'])
      })
  }
}
