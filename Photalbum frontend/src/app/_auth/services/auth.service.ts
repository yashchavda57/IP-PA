import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap, first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = new BehaviorSubject(false);

  onLogin  = new Subject<any>(); // deprecated
  onLogout  = new Subject<any>(); // deprecated

  private token: string  = null;
  private userData: UserModel = null;

  constructor(
    private http: HttpClient,

  ) {
    // try and find out if there was a localstorage token was set
    this.resolveToken();
  }

  validateTokenOnServer() {
    return this.http.get(environment['apiBaseUrl'] + '/api/auth/validate-token')
      .pipe(
        map(data => {
            return data['user'] ? data['user'] : false;
          }
        ),
        tap((status) => { if (status) { this.userData  = status['user']; } }),
        tap((status) => { if (!status) { this.isLoggedIn.next(false); } }),
        catchError(err => {
          return of(false);
        }),
      );
  }

  // check if localstorage token was set
  // if so, set the token in the service
  // and set the login status
  resolveToken(): boolean {
    this.token = localStorage.getItem('token');
    this.isLoggedIn.next(this.token ?  true : false);
    return this.token ? true : false;
  }

  getToken(): string {
    return this.token;
  }

  hasToken(): boolean  {
    return this.getToken() ? true : false;
  }

  async logout() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('userDetails')
    localStorage.removeItem('userId')
  }

  login({ username , password }): Observable<any>  {
    // clear some data
    this.clearData();

    const headers = { 'content-type': 'application/json'}
    // create the payload data for the api request
    const body  = {
      'email' : username,
      'password' : password
    };
    const newBody = JSON.stringify(body);

    // const data  = this.http.post<any>(environment['apiBaseUrl'] + '/api/v1/accounts/login' , body)
    // .subscribe(data=>{
    //   if(data){
    //     console.log("Heya");
    //   }
    // });
    return this.http.post<any>(environment['apiBaseUrl'] + 'api/v1/accounts/login/' , newBody, {'headers':{ 'content-type': 'application/json'}})
    // .subscribe(
    //   data => {
    //     if (data['refresh'] && data['user']) {

    //         this.setDataAfterLogin(data);
    //         this.isLoggedIn.next(true); // how do I unit test this?

    //         return data['user'];
    //     } else {
    //       return false;
    //     }
    //   }
    // )

    // this part only gets executed when the promise is resolved
    // if (data['token'] && data['user']) {

    //     this.setDataAfterLogin(data);
    //     this.isLoggedIn.next(true); // how do I unit test this?

    //     return data['user'];
    // } else {
    //   return false;
    // }
  }

  register({ email,password,repass, firstName, lastName }): Observable<any>{
    this.clearData();
    const headers = { 'content-type': 'application/json'}
    // create the payload data for the api request
    const body  = {
      'firstName' : firstName,
      'lastName' : lastName,
      'email' : email,
      'password' : password,
      'repass' : repass
    };
    const newBody = JSON.stringify(body);

    return this.http.post<any>(environment['apiBaseUrl'] + 'api/v1/accounts/register/', newBody,{'headers':{ 'content-type': 'application/json'}});
  }

  clearData() {
    this.userData  = null;
    this.token  = null;
    localStorage.clear();
  }

  getUserData(): UserModel {
    return this.userData;
  }

  private setDataAfterLogin(data) {
    this.token  = data['access'];

    // store some user data in the service
    this.userData  = data;

    // store some data in local storage (webbrowser)
    localStorage.setItem('token' , this.token);
    localStorage.setItem('usermeta' , JSON.stringify(this.userData));
  }
  clearLocalStorage(){
    localStorage.clear()
  }
}
