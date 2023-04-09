import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      status
      user {
        id
        username
        email
      }
      message
    }
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  username: string;
  password: string;

  constructor(private apollo: Apollo, private router: Router) { 
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
  
    this.apollo.watchQuery<any>({
      query: LOGIN_QUERY,
      variables: {
        username: username,
        password: password
      }
    } as any).valueChanges.subscribe(({data}) => {
      const loginResponse = data.login;
      console.log('loginResponse: ', loginResponse);
  
      if (loginResponse.status) {
        console.log(loginResponse.message)
        localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
        this.router.navigate(['/employees']);
      }
    }, (error) => {
      this.errorMessage = error.message;
    });
  }
  
}
