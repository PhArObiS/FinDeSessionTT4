import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

interface CollegeResponse {
  status: string;
  message:string;
  data: any;
}


interface Course {
  Id: number;
  Semester: string;
  Department: string;
  Course: string;
  TeacherId?: number;
  TeacherFirstName: string;
  TeacherLastName: string;
  SemesterId: number;
  CourseSemesterId: number;
  Location?: string; 
  Schedule?: string;
}

interface Student {
  StudentId: number;
  PersonId: number;
  fkCourseId: number,
  fkSemesterId: number,
  fkTeacherId: number,
  description: string,
  FirstName: string;
  LastName: string;
  Grade: number;
  CourseSemester: number;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  // Data source for the course grid. Initialized right away to avoid null issues.
  public gridCourse: MatTableDataSource<Course> = new MatTableDataSource<Course>([]);
  
  // Data source for the student grid. Initialized right away.
  public studentDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  // The columns that should be displayed in the grid.
  displayedColumns: string[] = ['Semester', 'Department', 'Course', 'Teacher'];

  // Holds the selected course data, if a course row is clicked.
  selectedCourse: Course | null = null;

  // ViewChild allows us to access the MatSort directive, which will be used for sorting the grid.
  @ViewChild(MatSort) sort!: MatSort;

  // Injecting the DataService into the component.
  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Fetching the courses data using the CourseSemesterGetAll method from DataService.
    this.dataService.CourseSemesterGetAll().subscribe(response => {
      // Check if the response status is 'success'
      if (response.status === 'success') {
        // If success, set the fetched data to gridCourse.
        this.gridCourse.data = response.data;
        // Attach sorting capability to the grid.
        this.gridCourse.sort = this.sort;
        
        // Fetch the list of teachers
        this.fetchTeacherList();
  
        // Set the default course
        const defaultCourse = this.gridCourse.data.find(course => course.Id === 1);
        if (defaultCourse) {
          this.displayCourseInfo(defaultCourse);
        }
      } else {
        // If there's an error, log the error message.
        console.error('Failed to fetch courses:', response.message);
      }
    });
  }
  
  

  // Function to filter the courses based on user input.
  applyFilter(filterValue: string) {
    this.gridCourse.filter = filterValue.trim().toLowerCase();
  }

  // If you want to handle row click events, use this method.
  displayCourseInfo(course: Course) {
    this.selectedCourse = course;
    console.log("Selected course's SemesterId:", this.selectedCourse?.SemesterId);
    console.log("Selected course:", this.selectedCourse);
    
    let courseIdToFetch = course.SemesterId || course.Id;
    if (courseIdToFetch) {
      this.fetchStudentsForGivenCourse(courseIdToFetch).subscribe(response => {
        if (response.status === 'success') {
          this.students = response.data;
          this.studentDataSource.data = this.students;
        } else {
          console.error("Error fetching students for course:", course);
        }
      });
    } else {
      console.error('Undefined CourseSemesterId for course:', course);
    }
  }
  

updateStudent(student: any): void {
  console.log('Updating student:', student);

  // Ensure you have a valid CourseSemesterId from the selected course
  if (!this.selectedCourse?.SemesterId) {
      console.error('No valid CourseSemesterId available.');
      return;
  }

  // Use the CourseSemesterId from the selected course
  this.dataService.CourseSemesterStudentUpdateGrade(this.selectedCourse.SemesterId, student.StudentId, student.Grade).subscribe(response => {
      if (response.status === 'success') {
          console.log('Successfully updated student:', response.data);
          // Handle successful update (e.g., refresh the list)
      } else {
          console.error('Failed to update student:', response.message);
      }
  });
}




removeStudent(student: any): void {
  const index = this.studentDataSource.data.indexOf(student);
  if (index >= 0) {
    const updatedStudents = [...this.studentDataSource.data];
    updatedStudents.splice(index, 1);
    this.studentDataSource.data = updatedStudents;
  }
}

confirmRemoval(student: any): void {
  console.log("Student.Id:", student.Id);
  
  const studentId = student.StudentId;
  const semesterId = this.selectedCourse?.SemesterId;

  if (!semesterId || !studentId) {
      console.error("Either SemesterId or StudentId is invalid. Exiting confirmDeletion.");
      return;
  }

  console.log("Selected Course SemesterId:", semesterId);
  console.log("Student StudentId:", studentId);

  if (confirm("Are you sure you want to delete this student's record?")) {
      // Use the DataService to delete the student from the backend
      this.dataService.CourseSemesterStudentDelete(semesterId, studentId).subscribe(response => {
        if (response.status === 'success') {
            this.removeStudent(student);
            alert('Successfully deleted student record.');
        } else {
            alert('Failed to delete student record: ' + response.message);
        }
    },
    error => {
        alert('An error occurred: ' + error.message);
    });
  }
}





public teachersList: {
  id: number,
  TeacherFirstName: string,
  TeacherLastName: string
}[] = [];
 
students: any[] = [];


  // This method fetches students for the selected course and populates the student data table.
  fetchStudentsForGivenCourse(CourseSemesterId: number): Observable<any> {
    if (!CourseSemesterId) {
      console.error("CourseSemesterId not provided");
      return throwError("CourseSemesterId not provided");
    }
  
    // Directly call the dataService method to fetch students
    return this.dataService.CourseSemesterStudentGetAll(CourseSemesterId);
  }





  fetchTeacherList() {
    this.dataService.getTeachers().subscribe((response: {status: string, data: any[]}) => {
      if (response.status === 'success') {
        this.teachersList = response.data.map(teacher => {
          return {
            id: teacher.TeacherId,
            TeacherFirstName: teacher.TeacherFirstName,
            TeacherLastName: teacher.TeacherLastName
          };
        });
      } else {
        console.error('Failed to fetch teachers:', response.status);
      }
    }, error => {
      console.error('An error occurred while fetching teachers:', error.message);
    });
  }

}
  


