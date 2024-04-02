import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleResponse } from '../Model/role-response';
import { LoginResponse } from '../Model/login-response';
import { UserEdit, UserReq } from '../Model/user-req';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  private apiUrlLogin = 'http://localhost:5010/api/Login';
  private apiUrl = 'http://localhost:5010/api/Auth';
  private URL = 'http://localhost:5010/api/Auth/';


  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    const loginEndpoint = `${this.apiUrlLogin}/login`;
    return this.http.post<LoginResponse>(loginEndpoint, credentials);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  storeRole(roleResponse: RoleResponse) {
    localStorage.setItem('role', JSON.stringify(roleResponse));
  }

  getRole(): RoleResponse | null {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      return JSON.parse(storedRole) as RoleResponse;
    }
    return null;
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login'])
  }

  addUser(userReq: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userReq);
  }

  getRolesDropdown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetRolesDropdown`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllUsers`);
  }

  getUserById(id:any):Observable<any>{
    return this.http.get<UserEdit>(`${this.apiUrl}/${id}`);
  }


  editUser(id:any,user:any){
    return this.http.put<UserEdit>(
      this.URL+ id,
      user
    );


}

deleteUser(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/DeleteUser/${id}`);
}
}
