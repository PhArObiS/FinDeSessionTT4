import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { MessageComponent } from '../message/message.component';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(public security: SecurityService, private router: Router) {}

  @ViewChild(MessageComponent) msg!: MessageComponent;

  username: string = "";
  password: string = "";
  isLoading: boolean = false;

  public btnLogin() {
    console.log("btnLogin clicked");
    this.security.validateCredentials(this.username, this.password).subscribe(
      () => {
        console.log("Inside subscription success");
        if (this.security.isConnected()) {
          console.log("User is connected, navigating to courses");
          this.router.navigate(['/home/courses']);
        } else {
          console.log("User is not connected");
          this.msg.showMessage(this.security.getMessage());
          this.username = "";
          this.password = "";
        }
      },
      (error) => {
        console.log("Error during login: ", error);
      }
    );
}

}
