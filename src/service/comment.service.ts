import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDTO } from 'src/dto/Comment/CommentDTO';
import { CreateCommentDTO } from 'src/dto/Comment/CreateCommentDTO';
import { ServiceResponse } from 'src/dto/ServiceResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  type: string = 'api/Comment';

  createComment(createCommentDTO: CreateCommentDTO): Observable<ServiceResponse<CommentDTO>>{
    return this.http.post<ServiceResponse<CommentDTO>>(environment.APIEndpoint + this.type + "/CreateComment", createCommentDTO);
  }

  getCommentsByPost(postId: number):Observable<ServiceResponse<CommentDTO[]>>{    
    return this.http.get<ServiceResponse<CommentDTO[]>>(environment.APIEndpoint + this.type + "/GetCommentsByPost/" + postId);
  }

}
