import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', Validators.required),
    salary: new FormControl(0, [Validators.required, Validators.min(0)])
  });
  status = '';
  message = '';
  errorMessage = '';
  warningMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.employeeForm.valid) {
      console.log('form is valid');
      const { first_name, last_name, email, gender, salary } = this.employeeForm.value;
  
      console.log('Submitting form data: ', { first_name, last_name, email, gender, salary });
  
      const body = {
        first_name,
        last_name,
        email,
        gender,
        salary: salary ? parseFloat(salary.toString()) : 0
      };
  
      this.http.post('https://sarah.warptower.outerwilds.net/graphql', {
        query: `
          mutation AddEmployee(
            $first_name: String!,
            $last_name: String!,
            $email: String!,
            $gender: String!,
            $salary: Float!
          ) {
            addEmployee(
              first_name: $first_name,
              last_name: $last_name,
              email: $email,
              gender: $gender,
              salary: $salary
            ) {
              status
              message
            }
          }
        `,
        variables: body
      }).subscribe({
        next: (result: any) => {
          console.log('Result received from server: ', result);
  
          const response = result.data.addEmployee;
          if (response.status) {
            this.status = response.status;
            this.message = response.message;
            // redirect to employees list
            this.router.navigate(['/employees'])
            .then(() => {
              window.location.reload();
            });
          } else {
            this.message = response.message;
            this.warningMessage = response.message;
          }
        },
        error: (error: any) => {
          console.log('Error received from server: ', error);
  
          this.status = 'error';
          this.errorMessage = error.message;
        }
      });
    }
  }
}