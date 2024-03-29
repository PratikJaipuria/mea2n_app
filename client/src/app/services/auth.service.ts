import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import { tokenNotExpired } from "angular2-jwt";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthServiceNative {
  authToken : any;
  user : any;
  constructor(private http : Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/register', user , {headers : headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/authenticate', user, {headers : headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/user/profile', {headers : headers})
      .map(res =>
        // console.log("Response at Auth " + res);
        res.json()
       );
  }

  googleLogIn(profile){
    // console.log(profile);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // accessToken = { "accessToken" : profile.token};
    return this.http.post('http://localhost:3000/oauth/google', profile, {headers : headers})
      .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token );
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
