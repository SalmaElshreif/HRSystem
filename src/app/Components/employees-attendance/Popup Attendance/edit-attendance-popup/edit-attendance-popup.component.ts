import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceService } from 'src/app/Services/attendance.service';


@Component({
  selector: 'app-edit-attendance-popup',
  templateUrl: './edit-attendance-popup.component.html',
  styleUrls: ['./edit-attendance-popup.component.css']
})
export class EditAttendancePopupComponent {
  attendanceForm!: FormGroup;
  employees: any[] = [];
  attendanceId: number | null = null;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditAttendancePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: AttendanceService, private toast: NgToastService) {
    this.attendanceId = data.attendanceId;
    this.fetchDate();
  }


  ngOnInit(): void {}

  fetchDate() {
    this.attendanceForm = this.fb.group({
      id: [this.attendanceId, Validators.required],
      attendanceTime: ['', Validators.required],
      departureTime: ['', Validators.required],
    });

    this.getAttendanceById();

    this.apiService.getAllEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }

  getAttendanceById() {
    this.apiService.getAttendanceById(this.attendanceId).subscribe({
      next: (value) => {
        const attendanceData = value;
        console.log('asdasdasdasdassdas');
        console.log(attendanceData);
        const formattedAttendance = formatDate(
          attendanceData.attendence,
          'yyyy-MM-ddTHH:mm',
          'en'
        );
        const formattedDeparture = formatDate(
          attendanceData.departure,
          'yyyy-MM-ddTHH:mm',
          'en'
        );

        if (attendanceData) {
          this.attendanceId = attendanceData.id;
          this.attendanceForm.patchValue({
            id: attendanceData.id,
            attendanceTime: formattedAttendance,
            departureTime: formattedDeparture,
          });

          console.log(attendanceData);
          console.log(this.attendanceForm.value);
        }
      },
    });
  }


  onSubmit(): void {
    if (this.attendanceForm.valid) {
      const attendanceTime = this.attendanceForm.value.attendanceTime;
      const departureTime = this.attendanceForm.value.departureTime;

      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;

      this.apiService
        .editAttendance(this.attendanceId!, attendanceTime, departureTime)
        .subscribe(
          (response) => {
            console.log('Attendance edited successfully');
            this.toast.success({
              detail: 'نجاح',
              summary: 'تم تعديل الحضور والانصراف بنجاح',
              duration: 5000,
            });
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error editing attendance:', error);
            this.dialogRef.close();
          }
        );
    }
  }

  OnClose(): void {
    this.dialogRef.close();
  }

}
