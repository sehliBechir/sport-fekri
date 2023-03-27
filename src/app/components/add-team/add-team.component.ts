import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TeamService } from './../../services/team.service';


@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  //form id 
  teamForm:FormGroup;
  team:any={};


  constructor(private teamService:TeamService) { }

  ngOnInit() {
  }

  addTeam(){
    console.log("Here team object", this.team );
    this.teamService.addTeamPlayer(this.team).subscribe(
      (response)=>{
        console.log("here response after addi,g team", response.message);
        
      }
    );
      }

}
