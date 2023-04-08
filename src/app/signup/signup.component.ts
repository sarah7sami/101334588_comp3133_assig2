import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string;
  email: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) {
    this.username = '';
    this.password = '';
    this.email = '';
  }

  onSubmit(): void {
    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.http.post('https://sarah.warptower.outerwilds.net/', {
      query: `
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            status
            user {
              id
              username
              email
            }
            message
          }
        }
      `,
      variables: body
    }).subscribe((response: any) => {
      if (response.data.signup.status) {
        localStorage.setItem('user', JSON.stringify(response.data.signup.user));
        this.router.navigate(['/employees']);
      } else {
        alert(response.data.signup.message);
      }
    });
  }
}