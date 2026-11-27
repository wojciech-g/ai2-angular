import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Person } from '../person';
import { PersonLs } from '../person-ls';

@Component({
  selector: 'app-details',
  imports: [
    RouterLink
  ],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {
  personId?: number;
  person?: Person;

  constructor(
    private route: ActivatedRoute,
    private personLsService: PersonLs,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.personId = Number(params['id']);
      this.person = this.personLsService.getPerson(this.personId);
    });
  }
}
