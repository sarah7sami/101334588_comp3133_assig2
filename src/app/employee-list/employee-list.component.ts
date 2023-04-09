import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular'; // updated import and added gql here
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
}