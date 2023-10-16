import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { SecurityService } from '../security.service'; // Adjust the path as needed

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public security: SecurityService, private router: Router) {}

  IsCoursSelected(): boolean {
    // Check if the current URL is "/home/courses"
    return this.router.url === "/home/courses";
  }

  IsEtudiantsSelected(): boolean {
    // Check if the current URL is "/home/students"
    return this.router.url === "/home/students";
  }

  logout() {
    this.security.logout(); // call the logout method from the SecurityService
    this.router.navigate(['/login']); // navigate to the login page
  }
}
