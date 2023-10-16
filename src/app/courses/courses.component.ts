import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Define the structure of a course.
interface Course {
  Semester: string;
  Department: string;
  Course: string;
  Teacher: string;
  // Add other required fields if necessary...
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
    // Any other logic you'd like to execute when a course is selected goes here...
  }

  // This method fetches students for the selected course and populates the student data table.
  fetchStudentsForCourse(course: Course) {
    // You'll have to implement a method in DataService that fetches students for a given course.
    // This is a dummy implementation, adjust based on your API and DataService.
    // this.dataService.getStudentsForCourse(course.CourseId).subscribe(response => {
    //   if (response.status === 'success') {
    //     this.studentDataSource.data = response.data;
    //   } else {
    //     console.error('Failed to fetch students for course:', response.message);
    //   }
    // });
  }

  // Logic for updating the grade or removing a student from a course will go here...

}
