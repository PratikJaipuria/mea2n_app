import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from "@angular/router";
import {FlashMessagesModule, FlashMessagesService} from "angular2-flash-messages";
import { Angular2SocialLoginModule} from "angular2-social-login";

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProfileComponent } from './component/profile/profile.component';

import { ValidateService} from "./services/validate.service";
import { AuthServiceNative} from "./services/auth.service";
import {AuthGuard} from "./guards/auth.guard";

const appRoutes : Routes = [
  {path: '', component : HomeComponent},
  {path: 'register', component : RegisterComponent},
  {path: 'login', component : LoginComponent},
  {path: 'dashboard', component : DashboardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component : ProfileComponent, canActivate: [AuthGuard]}
]

const socialLoginProvider = {
  "google" : {
    "clientId" : "793666480779-mk0fr11cd3nuhftncp3qkqr7pfcsnkqn.apps.googleusercontent.com"
    // clientSecret : "6awsCm7ddASWLVoLGJb24wQ8"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    Angular2SocialLoginModule

  ],
  providers: [ValidateService,FlashMessagesService, AuthServiceNative, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
Angular2SocialLoginModule.loadProvidersScripts(socialLoginProvider);
