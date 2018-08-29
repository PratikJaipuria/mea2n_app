import { Component, OnInit } from '@angular/core';
import { AuthServiceNative } from "../../services/auth.service";
import { Router} from "@angular/router";
import { FlashMessagesService} from "angular2-flash-messages";
import { AuthService} from "angular2-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : String;
  password : String;

  constructor(
    private authService : AuthServiceNative,
    private router : Router,
    private flashMessage : FlashMessagesService,
    public socialAuth : AuthService) { }


  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username : this.username,
      password : this.password
    }


    this.authService.authenticateUser(user).subscribe(data =>{
      if(data.success){
        this.authService.storeUserData(data.token , data.user);
        this.flashMessage.show('You are now logged in', {cssClass : 'alert-success', timeout : 5000});
        this.router.navigate(['dashboard']);
      }else{
        this.flashMessage.show(data.msg, {cssClass : 'alert-danger', timeout : 5000});
        this.router.navigate(['login']);
      }
      });
  }

  googleLogIn(){

    this.socialAuth.login("google").subscribe(data =>{

      if(data){
        const dataObject = {
          access_token : data['token']
        };
        this.authService.googleLogIn(dataObject).subscribe(dataG =>{
          if(dataG.success){
            console.log(dataG.user);
            this.authService.storeUserData(dataG.token , dataG.user);
            this.flashMessage.show('Hey, You are now logged in', {cssClass : 'alert-success', timeout : 5000});
            this.router.navigate(['/dashboard']);
          }else{
            this.flashMessage.show("Google Login Falied", {cssClass : 'alert-danger', timeout : 5000});
            this.router.navigate(['/login']);
          }
        });
      } else{
        this.flashMessage.show("Google Login Falied", {cssClass : 'alert-danger', timeout : 5000});
        this.router.navigate(['login']);
      }

    });

  }
}
