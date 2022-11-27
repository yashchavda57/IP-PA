import { Component, OnInit , Inject } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl , Validator , FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

import { CheckRequiredField } from '../_shared/helpers/form.helper';
import { AuthService } from '../_auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  processing: Boolean = false;
  error: Boolean = false;
  userData: any ;

  checkField  = CheckRequiredField;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.authService.hasToken()) {
      this.handleLoginSuccess();
    } else {
      this.initForm();
    }
    this.checkLocalStorage()
  }

  // checkRequiredClass(frmControl: string) {
  //   const t  = this.loginForm.get()
  //   return {
  //     'required' : false
  //   };
  // }

  onSubmitButtonClicked() {
    this.error  = false;
    this.processing  = false;
    if (this.loginForm.valid) {
      this.login();
    }
  }

  private login() {
    this.processing  = true;
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        if (data) {
          this.userData = data
          this.handleLoginSuccess();
        } else {
          this.handleLoginError();
        }
      },
      err => {
        console.log('---- ERROR ---- ');
        console.log(err);
        this.handleLoginError();
      });
  }

  private handleLoginSuccess() {
    this.processing = false;
    this.error  = false;
    localStorage.setItem('userDetails', JSON.stringify(this.userData))
    this.authService.isLoggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError() {
    this.processing = false;
    this.error  = true;
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [ Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onRegisterButtonClicked(){
    this.router.navigate(['/register']);
  }

  checkLocalStorage(){
    if(localStorage.getItem('userDetails') !== null){
      this.authService.clearLocalStorage();
    }
  }

}
