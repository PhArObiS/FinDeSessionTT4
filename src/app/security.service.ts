import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CollegeResponse {
  status: string;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private connected: boolean = false;
  private message: string = "";

  constructor(private data: DataService) {}

  isConnected(): boolean {
    return this.connected;
  }

  getMessage(): string {
    return this.message;
  }

  validateCredentials(user: string, password: string): Observable<CollegeResponse> {
    // Return the observable, and use tap to handle the side effects
    return this.data.AccountValidate(user, password).pipe(
      tap((response: CollegeResponse) => {
        if (response.status === "success") {
          this.connected = true;
        } else {
          this.message = response.message;
        }
      })
    );
  }

  logout(): void {
    this.connected = false;
  }
}
