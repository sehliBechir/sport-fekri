import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
teamUrl: string= "http://localhost:3000/teams";
  constructor(private httpClient:HttpClient) { }


  addTeamPlayer(teamObj) {
    return this.httpClient.post<{message:string}>(this.teamUrl, teamObj);
  }

    //Request to get all matches(non param) -> Response: [{},{},....]
    getAllTeams() {
      return this.httpClient.get<{teams:any , message:string}>(this.teamUrl);
    }

    deleteTeams(id) {
      return this.httpClient.delete<{message:string}>(`${this.teamUrl}/${id}`);
    }

    getTeamById(id) {
      return this.httpClient.get<{teams:any}>(`${this.teamUrl}/${id}`);
    }
}


