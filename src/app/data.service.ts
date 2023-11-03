import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

interface CollegeResponse {
  status: string;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly BASE_URL: string;
  private readonly PORT: number = 7218;

  constructor(private http: HttpClient) {
    this.BASE_URL = `https://localhost:${this.PORT}/College`;
  }

  private constructUrl(method: string, parameters: any[]): string {
    return `${this.BASE_URL}?method=${method}&parameters=${JSON.stringify({ parameters })}`;
  }

  // { GET }
  AccountValidate(user: string, password: string): Observable<CollegeResponse> {
    let method: string = "AccountValidate";
    let parameters = [user, password];
    let urlToCall = this.constructUrl(method, parameters);

    return this.http.get<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('AccountValidate'))
    );
  }

  CourseSemesterGetAll(): Observable<CollegeResponse> {
    let urlToCall = this.constructUrl("CourseSemesterGetAll", []);
    return this.http.get<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterGetAll'))
    );
  }

  CourseSemesterStudentGetAll(CourseSemesterId: number): Observable<CollegeResponse> {
    let method: string = "CourseSemesterStudentGetAll";
    let parameters = [CourseSemesterId.toString()];
    let urlToCall = this.constructUrl(method, parameters);

    return this.http.get<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterStudentGetAll'))
    );
  }
  
  PersonGetAll(Role: string): Observable<CollegeResponse> {
    let urlToCall = this.constructUrl("PersonGetAll", [Role]);
    return this.http.get<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('PersonGetAll'))
    );
  }

  // { POST }
  CourseSemesterStudentInsert(CourseSemesterId: number, StudentId: number): Observable<CollegeResponse> {
    let method: string = "CourseSemesterStudentInsert";
    let parameters = [CourseSemesterId.toString(), StudentId.toString()];
    let urlToCall = this.constructUrl(method, parameters);
    
    return this.http.post<CollegeResponse>(urlToCall, parameters).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterStudentInsert'))
      );
    }
    
  // { PATCH }
  CourseSemesterUpdateTeacher(CourseSemesterId: number, TeacherId: number): Observable<CollegeResponse> {
    let method: string = "CourseSemesterUpdateTeacher";
    let parameters = [CourseSemesterId.toString(), TeacherId.toString()];
    let urlToCall = this.constructUrl(method, parameters);
    
    return this.http.patch<CollegeResponse>(urlToCall, parameters).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterUpdateTeacher'))
    );
  }

  CourseSemesterStudentUpdateGrade(Id: number, StudentId: number, Grade: number): Observable<CollegeResponse> {
    let method: string = "CourseSemesterStudentUpdateGrade";
    let parameters = [Id.toString(), StudentId.toString(), Grade.toString()];
    let urlToCall = this.constructUrl(method, parameters);
    
    return this.http.patch<CollegeResponse>(urlToCall, parameters).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterStudentUpdateGrade'))
    );
  }

  // { PUT }
  PersonUpdateInfo(PersonId: number, FirstName: string, LastName: string, Phone: string, Email: string): Observable<CollegeResponse> {
    let method: string = "PersonUpdateInfo";
    let parameters = [PersonId.toString(), FirstName, LastName, Phone, Email]
    let urlToCall = this.constructUrl(method, parameters);

    return this.http.put<CollegeResponse>(urlToCall, parameters).pipe(
      catchError(this.handleError<CollegeResponse>('PersonUpdateInfo'))
    );  
  }

  CourseSemesterStudentDelete(Id: number, studentId: number): Observable<CollegeResponse> {
    console.log("Sending CourseSemesterId:", Id);
    console.log("Sending StudentId:", studentId);

    let method: string = "CourseSemesterStudentDelete";
    let parameters = [Id.toString(), studentId.toString()]; // Adjusted variable names
    let urlToCall = this.constructUrl(method, parameters);
    
    return this.http.delete<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterStudentDelete'))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return new Observable<T>(observer => {
        observer.error({
          status: 'error',
          message: `Failed to perform operation: ${operation}`,
          data: null
        });
      });
    };
  }
}
