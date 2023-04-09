import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            employees {
              id
              first_name
              last_name
              email
              gender
              salary
            }
          }
        `
      })
      .valueChanges.pipe(
        map((result) => result.data.employees)
      )
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  deleteEmployee(id: string) {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.apollo
        .mutate<any>({
          mutation: gql`
            mutation deleteEmployee($id: ID!) {
              deleteEmployee(id: $id) {
                status
                message
              }
            }
          `,
          variables: {
            id: id
          }
        })
        .subscribe(({ data }) => {
          if (data.deleteEmployee.status) {
            this.employees = this.employees.filter((employee) => employee.id !== id);
            console.log(data.deleteEmployee.message);
          } else {
            console.log(data.deleteEmployee.message);
          }
        });
    }
  }  
}