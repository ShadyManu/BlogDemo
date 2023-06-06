import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePostDTO } from 'src/dto/Post/CreatePostDTO';
import { PostDTO } from 'src/dto/Post/PostDTO';
import { ServiceResponse } from 'src/dto/ServiceResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  type: string = 'api/Post';

  createPost(createPostDTO: CreatePostDTO): Observable<ServiceResponse<PostDTO>>{
    return this.http.post<ServiceResponse<PostDTO>>(environment.APIEndpoint + this.type + "/CreatePost", createPostDTO);
  }

  getAllPosts(): Observable<ServiceResponse<PostDTO[]>> {
    return this.http.get<ServiceResponse<PostDTO[]>>(environment.APIEndpoint + this.type + "/GetAllPosts");
  }

  getPostById(id: number): Observable<ServiceResponse<PostDTO>>{
    return this.http.get<ServiceResponse<PostDTO>>(environment.APIEndpoint + this.type + "/GetPost/" + id);
  }
}
