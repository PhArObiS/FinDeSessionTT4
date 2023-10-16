import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { SecurityService } from './security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'connection';

  constructor(public security: SecurityService, private router: Router) {}

  ngOnInit() {
    if (!this.security.isConnected()) {
        this.router.navigate(['login']);
    }
}

}
