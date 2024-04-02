import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeesAttendanceComponent } from '../Components/employees-attendance/employees-attendance.component';
import { Observable, catchError, throwError } from 'rxjs';
import { Employee } from '../Model/employee';
import { AttendanceModel } from '../Model/attendance-model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseURL = 'http://localhost:5010/api/Attendance';

  constructor(private http: HttpClient) { }

  getAllEmployeeAttendance(): Observable<EmployeesAttendanceComponent[]> {
    return this.http.get<EmployeesAttendanceComponent[]>(this.baseURL + '/GetAllEmployeeAttendance');
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseURL + '/GetAllEmployees');
  }

  addAttendance(employeeId: number, attendance: Date) {
    const formData = {
      id: 0,
      EmployeeId: employeeId,
      Attendance: attendance,
    };
    return this.http.post(`${this.baseURL}`, formData);
  }

  deleteEmployeeAttendance(id: number) {
    return this.http.delete(`${this.baseURL}/DeleteEmployeeAttendance/${id}`);
  }


  getAttendanceById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseURL}/${id}`);
  }

  editAttendance(
    attendanceId: number,
    attendanceDateTime: Date,
    departureDateTime: Date
  ): Observable<any> {
    const body = {
      id: attendanceId,
      attendance: attendanceDateTime, 
      departure: departureDateTime, 
    };
    return this.http.put<any>(`${this.baseURL}`, body);
  }


  getEmployeeAttendanceBetweenDates(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.baseURL}/GetEmployeeAttendanceBetweenDates?startDate=${startDate}&endDate=${endDate}`);
  }


}
