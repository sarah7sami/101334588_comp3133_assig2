import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  employee: any;

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const query = gql`
      query GetEmployee($id: ID!) {
        employee(id: $id) {
          id
          first_name
          last_name
          email
          gender
          salary
        }
      }
    `;
    this.apollo
      .watchQuery<any>({
        query: query,
        variables: {
          id: id
        }
      })
      .valueChanges.subscribe(result => {
        this.employee = result.data.employee;
      });
  }
}