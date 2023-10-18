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
    if (CourseSemesterId === undefined || CourseSemesterId === null) {
      return new Observable<CollegeResponse>(observer => {
        observer.error({
          status: 'error',
          message: 'Invalid CourseSemesterId',
          data: null
        });
      });
    }

    let urlToCall = this.constructUrl("CourseSemesterStudentGetAll", [CourseSemesterId.toString()]);
    return this.http.get<CollegeResponse>(urlToCall).pipe(
      catchError(this.handleError<CollegeResponse>('CourseSemesterStudentGetAll'))
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

getTeachers(): Observable<CollegeResponse> {
  let urlToCall = this.constructUrl("CourseSemesterGetAll", []);
  return this.http.get<CollegeResponse>(urlToCall).pipe(
    catchError(this.handleError<CollegeResponse>('CourseSemesterGetAll'))
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
