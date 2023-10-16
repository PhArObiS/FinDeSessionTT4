import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

interface CollegeResponse {
  status: string;
  message:string;
  data:any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  private port:number = 7218; 

  AccountValidate(user:string, password:string) : Observable<CollegeResponse>
  {

    let method:string = "AccountValidate";
    let parameters = {parameters: [user, password]};

    let urlToCall:string = "https://localhost:"+this.port.toString()+"/College?method="+method+"&parameters="+JSON.stringify(parameters);

    return this.http.get<CollegeResponse>(urlToCall);    

  }

  CourseSemesterGetAll() : Observable<CollegeResponse>
  {

    let method:string = "CourseSemesterGetAll";
    let parameters = {parameters: []};

    let urlToCall:string = "https://localhost:"+this.port.toString()+"/College?method="+method+"&parameters="+JSON.stringify(parameters);

    return this.http.get<CollegeResponse>(urlToCall);    

  }

}
