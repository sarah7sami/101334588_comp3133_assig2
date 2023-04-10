import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router) {}

  public login(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  public signup(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}