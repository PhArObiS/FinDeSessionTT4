import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

interface Course {
  Id: number;
  Semester: string;
  Department: string;
  Course: string;
  TeacherId: number;
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

interface Person {
  Id: number;
  FirstName: string;
  LastName: string;
  Role: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})

export class CoursesComponent implements OnInit {
  public gridCourse: MatTableDataSource<Course> = new MatTableDataSource<Course>([]);
  public gridStudents: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
  public gridProfesseur: any[];

  displayedColumns: string[] = ['Semester', 'Department', 'Course', 'Teacher'];
  diplayedStudentColumns = ['StudentId', 'FirstName', 'LastName', 'Grade', 'actions'];
  displayedTeacherColumns = ['TeacherId', 'FirstName', 'LastName'];
  
  selectedCourse: Course | null = null;
  courseSemesterId: number = 0;
  selectedTeacherId: number = 0;

  students: any[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) {
    this.gridProfesseur = new Array();
  }

  ngAfterViewInit() {
    this.gridCourse.sort = this.sort;
  }

  ngOnInit() {
    this.initializeCourseGrid();
  }

  private initializeCourseGrid() {
    // Fetching the courses data using the CourseSemesterGetAll method from DataService.
    this.dataService.CourseSemesterGetAll().subscribe(response => {
      if (response.status === 'success') {
        this.gridCourse = new MatTableDataSource(response.data);
        console.log(response.data);
        
        this.gridCourse.sort = this.sort;
        console.log("Course Grid created :", this.gridCourse);
        
        this.fetchUniqueTeacherList();
        console.log("Unique Teacher List created :", this.gridProfesseur);
  
        const defaultCourse = this.gridCourse.data.find(course => course.Id === 1);
        if (defaultCourse) {
          this.displayCourseInfo(defaultCourse);
          console.log("Default course:", defaultCourse);
        }
      } else {
        console.error('Failed to fetch courses:', response.message);
      }
    });
  }

  // Function to filter the courses based on user input.
  applyFilter(filterValue: string) {
    this.gridCourse.filter = filterValue.trim().toLowerCase();
  }

  displayCourseInfo(course: Course) {
    this.selectedCourse = course;
    this.dataService.CourseSemesterStudentGetAll(course.Id).subscribe(response => {
      if (response.status === 'success') {
        this.gridStudents.data = response.data;
        console.log("Students:", this.gridStudents.data);
      } else {
        console.error('Failed to fetch students:', response.message);
      }
    });
  }

  // fetch students by selected course and populate the mat-table (gridStudents)
  fetchStudentsForGivenCourse(CourseSemesterId: number): void {
    this.dataService.CourseSemesterStudentGetAll(CourseSemesterId).subscribe(response => {
      if (response.status === 'success') {
        this.gridStudents.data = response.data;
      } else {
        console.error('Failed to fetch students:', response.message);
      }
    });
  }
  
  updateStudent(student: any): void {
    console.log('Updating student:', student);if (!this.selectedCourse?.SemesterId) {
      console.error('No valid CourseSemesterId available.');
      return;
    }
    
    this.dataService.CourseSemesterStudentUpdateGrade(this.selectedCourse.Id, student.StudentId, student.Grade).subscribe(response => {
      if (response.status === 'success') {
        console.log('Successfully updated student:', response.data);
        this.refreshCourseGrid();
      } else {
        console.error('Failed to update student:', response.message);
      }
    });
  }

  removeStudent(student: any): void {
    const index = this.gridStudents.data.indexOf(student);
    if (index >= 0) {
      const updatedStudents = [...this.gridStudents.data];
      updatedStudents.splice(index, 1);
      this.gridStudents.data = updatedStudents;
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

    if (confirm("Etes-vous sûr de vouloir supprimer le dossier de cet élève?")) {
        this.dataService.CourseSemesterStudentDelete(semesterId, studentId).subscribe(response => {
          if (response.status === 'success') {
              this.removeStudent(student);
              alert('Dossier étudiant supprimé avec succès.');
          } else {
              alert('Échec de la suppression du dossier de l\'élève: ' + response.message);
            }
          },
      error => {
          alert(' ' + error.message);
      });
    }
  }

  fetchUniqueTeacherList(): void {
    this.dataService.PersonGetAll('Teacher').subscribe(response => {
      if (response.status === 'success') {
        console.log("Teacher list created :", response.data);
        this.gridProfesseur = response.data;
        this.gridProfesseur.unshift({ Id : null, TeacherFirstName: '', TeacherLastName: ''});
      } else {
        console.error('Failed to fetch teachers:', response.message);
      }
    });
  }

  updateTeacher(selectedTeacherId: number): void {
    if (!this.selectedCourse || !this.selectedCourse.Id) {
      console.error('No valid CourseSemesterId available, contact the IT dept right away!');
      return;
    }
    this.dataService.CourseSemesterUpdateTeacher(this.selectedCourse.Id, this.selectedTeacherId).subscribe(response => {
      if (response.status === 'success') {
        console.log('Successfully updated teacher:', response.data);
        this.refreshCourseGrid();
      } else {
        console.error('Failed to update teacher:', response.message);
      }
    });
  }

  private refreshCourseGrid() {
    this.dataService.CourseSemesterGetAll().subscribe(response => {
      if (response.status === 'success') {
        this.gridCourse = new MatTableDataSource(response.data);
        this.gridCourse.sort = this.sort;
      } else {
        console.error('Failed to fetch courses:', response.message);
      }
    });
  }
}