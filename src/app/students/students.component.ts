import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Injectable } from '@angular/core';

interface CollegeResponse {
  status: string;
  message: string;
  data: any;
}

interface Student {
  Id: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})

export class StudentsComponent implements OnInit {
  public gridStudents: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);

  displayedColumns: string[] = ['FirstName', 'LastName', 'Phone', 'Email'];
  selectedStudent: Student = { Id: 0, FirstName: '', LastName: '', Phone: '', Email: ''};

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    this.gridStudents.sort = this.sort;
  }

  ngOnInit(): void {
    this.fetchStudentList();
  }

  applyFilter(filterValue: string): void {
    this.gridStudents.filter = filterValue.trim().toLowerCase();
  }
  
  fetchStudentList(): void {
    this.dataService.PersonGetAll('student').subscribe(response => {
      if (response.status === 'success') {
        this.gridStudents.data = response.data;
      } else {
        console.error('Failed to fetch students', response.message);
      }
    });
  }
  
  displayStudentInfo(student: Student) {
    this.selectedStudent = student;
  }

  updateStudent(student: any): void {
    this.dataService.PersonUpdateInfo(student.Id, student.FirstName, student.LastName, student.Phone, student.Email).subscribe(response => {
      if (response.status === 'success') {
        console.log('Les informations sur les étudiants ont été mises à jour avec succès.');
      } else {
        console.error('Failed to update student info.', response.message);
      }
    });
  }
}