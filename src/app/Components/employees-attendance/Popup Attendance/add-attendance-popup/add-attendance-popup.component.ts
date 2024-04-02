import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceService } from 'src/app/Services/attendance.service';

@Component({
  selector: 'app-add-attendance-popup',
  templateUrl: './add-attendance-popup.component.html',
  styleUrls: ['./add-attendance-popup.component.css']
})
export class AddAttendancePopupComponent implements OnInit {
  attendanceForm!: FormGroup;
  employees: any[]=[];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddAttendancePopupComponent>, private apiService: AttendanceService, private toast: NgToastService) { }

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      employeeId: ['', Validators.required],
      attendanceDate: ['', Validators.required],
      attendanceTime: ['', Validators.required],
    });

    this.apiService.getAllEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }


  onSubmit(): void {
    if (this.attendanceForm.valid) {
      const employeeId = this.attendanceForm.value.employeeId;
      const attendanceDate = this.attendanceForm.value.attendanceDate;
      const attendanceTime = this.attendanceForm.value.attendanceTime;  
      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
  
      const attendanceDateTime = new Date(new Date(`${attendanceDate}T${attendanceTime}`).getTime() - userTimezoneOffset);

      this.apiService.addAttendance(employeeId, attendanceDateTime).subscribe(
        (response) => {
          console.log('Attendance added successfully');
          this.toast.success({
            detail: 'نجاح',
            summary: 'تم إضافة وقت الحضور بنجاح',
            duration: 5000,
          });
          this.attendanceForm.reset();
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error adding attendance:', error);
          this.dialogRef.close();
        }
      );
    }
  }

  OnClose():void{
    this.dialogRef.close();
  }

}

