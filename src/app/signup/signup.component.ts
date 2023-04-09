import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  errorMessage: string;
  username: string;
  email: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) {
    this.username = '';
    this.password = '';
    this.email = '';
    this.errorMessage = '';
  }

  onSubmit(): void {
    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.http.post('https://sarah.warptower.outerwilds.net/graphql', {
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
      if (response.data && response.data.signup.status && response.data.signup.message === "User registered successfully") {
        localStorage.setItem('user', JSON.stringify(response.data.signup.user));
        this.router.navigate(['/employees']);
      } else {
        console.log(response);
        this.errorMessage = response.errors[0].message;
      }
    });
  }
}