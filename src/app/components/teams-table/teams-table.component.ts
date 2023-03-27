import { Component, OnInit } from '@angular/core';
import { TeamService } from './../../services/team.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-table',
  templateUrl: './teams-table.component.html',
  styleUrls: ['./teams-table.component.css']
})
export class TeamsTableComponent implements OnInit {

  teams: any = [];

  constructor(private teamService: TeamService, private router: Router) { }

  ngOnInit() {

    this.teamService.getAllTeams().subscribe(
      (data) => { this.teams = data.teams }
    );

  }
  displayTeams(id){
    this.router.navigate([`team-info/${id}`]);
  }
  editTeams(x: number) {
    alert("Display team N°" + x);
  }
  deleteTeams(id) {
    this.teamService.deleteTeams(id).subscribe(
      (response) => {
        console.log("here response after delete", response.message);

        this.teamService.getAllTeams().subscribe(
          (data) => { this.teams = data.teams }
        );


      }
    );

  }

}
