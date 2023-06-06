import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from 'src/dto/ServiceResponse';
import { UserDTO } from 'src/dto/User/UserDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  type: string = 'api/User';

  getUser():Observable<ServiceResponse<UserDTO>> {
    return this.http.get<ServiceResponse<UserDTO>>(environment.APIEndpoint + this.type + '/GetUser');
  }
  
}
