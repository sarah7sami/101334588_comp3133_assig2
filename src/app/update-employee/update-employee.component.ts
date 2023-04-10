import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  employeeData: any = {};
  
  editEmployeeForm = new FormGroup({
    first_name: new FormControl(this.employeeData.first_name, Validators.required),
    last_name: new FormControl(this.employeeData.last_name, Validators.required),
    email: new FormControl(this.employeeData.email, [Validators.required, Validators.email]),
    gender: new FormControl(this.employeeData.gender, Validators.required),
    salary: new FormControl(this.employeeData.salary, [Validators.required, Validators.min(0)])
  });

  status = '';
  message = '';
  errorMessage = '';
  warningMessage = '';
  employeeId = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.employeeId = params['id'];
      this.fetchEmployeeData();
    });

    this.editEmployeeForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
      salary: new FormControl('', [Validators.required, Validators.min(0)])
    });
  }

  fetchEmployeeData(): void {
    this.http
      .post('https://sarah.warptower.outerwilds.net/graphql', {
        query: `
          query EmployeeById($id: ID!) {
            employee(id: $id) {
              first_name
              last_name
              email
              gender
              salary
            }
          }
        `,
        variables: {
          id: this.employeeId
        }
      })
      .subscribe({
        next: (result: any) => {
          console.log('Result received from server: ', result);

          this.employeeData = result.data.employee;
          this.editEmployeeForm.patchValue(this.employeeData);
        },
        error: (error: any) => {
          console.log('Error received from server: ', error);

          this.status = 'error';
          this.errorMessage = error.message;
        }
      });
  }

  onSubmit(): void {
    if (this.editEmployeeForm.valid) {
      console.log('form is valid');
      const { first_name, last_name, email, gender, salary } = this.editEmployeeForm.value;

      console.log('Submitting form data: ', { first_name, last_name, email, gender, salary });

      const body = {
        id: this.employeeId,
        first_name,
        last_name,
        email,
        gender,
        salary: salary ? parseFloat(salary.toString()) : 0
      };

      this.http.post('https://sarah.warptower.outerwilds.net/graphql', {
        query: `
          mutation UpdateEmployee(
            $id: ID!,
            $first_name: String,
            $last_name: String,
            $email: String,
            $gender: String,
            $salary: Float
          ) {
            updateEmployee(
              id: $id,
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
          const response = result.data.updateEmployee;
          if (response.status) {
            this.status = response.status;
            this.message = response.message;
            // redirect to employees list
            
            this.router.navigate(['/employees']);
            location.reload();
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
    } else {
      console.log('form is invalid');
    }
  }
}
      