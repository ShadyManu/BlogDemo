import { Component, Input, OnInit } from '@angular/core';
import { CommentDTO } from 'src/dto/Comment/CommentDTO';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(){}

  @Input() comment: CommentDTO;

  ngOnInit(): void {
  }

}
