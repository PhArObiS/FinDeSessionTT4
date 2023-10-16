import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';

import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

import { MessageComponent } from '../message/message.component';


interface CollegeResponse {
  status: string;
  message:string;
  data:any;
}

interface Customer {
  Id:number,
  FirstName:string,
  LastName:string,
  Phone:string,
  Email:string,
  Created:Date,
  Role:string
}
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent {}

// {

//   public gridCustomers:MatTableDataSource<Customer>;
//   displayedColumns : any[] = ['firstName', 'lastName', 'phone', 'email'];

//   constructor(private data: DataService) 
//   { 
//     this.gridCustomers = new MatTableDataSource<Customer>;
//   }

//   @ViewChild(MessageComponent) msg!: MessageComponent;  

//   ngOnInit()
//   {
    
//     this.data.getCustomers().subscribe((response: BikeResponse) => this.customerGetAllObserved(response));

//   }

  // customerGetAllObserved(response: BikeResponse)
  // {

  //   console.log("customerGetAllObserved");
  //   console.log(response);
    
  //   if (response.status == "success")
  //   {
  //     this.gridCustomers = new MatTableDataSource(response.data);
  //   }
  //   else
  //   {
  //     console.log("customerGetAllObserved failed");
  //     console.log(response.message);      
  //   }

  // }  

  // onRowClicked(customer:Customer)
  // {
  //   console.log("onRowClicked");
  //   console.log(customer);


  // }


 

