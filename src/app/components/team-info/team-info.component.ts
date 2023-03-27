import { Component, OnInit } from '@angular/core';
import { TeamService } from './../../services/team.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {


  team:any={}
  id:any;
  constructor(private teamService: TeamService, private activateRouter: ActivatedRoute) { }

  ngOnInit() {

    this.id = this.activateRouter.snapshot.paramMap.get("id");
    this.teamService.getTeamById(this.id).subscribe(
      (data)=>{
       this.team = data.teams}
    )
  }

}
