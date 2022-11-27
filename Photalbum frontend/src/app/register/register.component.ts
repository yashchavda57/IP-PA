import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  processing: Boolean = false;
  error: Boolean = false;
  loginForm: FormGroup;
  userData: any ;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      repass: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    });
  }

  onRegisterClick(){
    this.error  = false;
    this.processing  = false;
    if (this.loginForm.valid) {
      this.register();
    }
  }

  private register(){
    this.processing = true;
    console.log(this.loginForm.value);
    this.authService.register(this.loginForm.value).subscribe(
      data=>{
        if(data){
          this.userData = data
          this.handleLoginSuccess();
        }else {
          console.log("Failure");

        }
      },
      err => {
        console.log('---- ERROR ---- ');
        console.log(err);
        this.handleLoginError();
      }
    )
  }

  private handleLoginError() {
    this.processing = false;
    this.error  = true;
  }

  private handleLoginSuccess() {
    this.processing = false;
    this.error  = false;
    localStorage.setItem('userDetails', JSON.stringify(this.userData))
    this.authService.isLoggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }


}
