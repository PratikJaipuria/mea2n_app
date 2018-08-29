import { Component, OnInit } from '@angular/core';
import { ValidateService} from "../../services/validate.service";
import { AuthServiceNative} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  firstName : String;
  lastName : String;
  username : String;
  password : String;
  email : String;

  constructor(
    private validateService : ValidateService,
    private flashMessage : FlashMessagesService,
    private authService : AuthServiceNative,
    private router : Router) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    console.log(this.firstName + " " + this.lastName + " " + this.username);
    const user = {
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      username : this.username,
      password : this.password
    }
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show("Please fill in all fields", {cssClass : 'alert-danger', timeout : 5000});
      return false;
    }

    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show("Please use a valid email", {cssClass : 'alert-danger', timeout : 5000});
      return false;
    }

    //Register User
    this.authService.registerUser(user)
      .subscribe(data => {
        if(data.success){
          this.flashMessage.show("You are now Registered and can log in", {cssClass : 'alert-success', timeout : 5000});
          this.router.navigate(['/login']);
        }else{
          this.flashMessage.show("Something went wrong !!", {cssClass : 'alert-danger', timeout : 5000});
          this.router.navigate(['/register']);
        }
      })
  }

}
