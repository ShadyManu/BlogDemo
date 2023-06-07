export class CreateCommentDTO{
    postId: number;
    body: string;

    constructor(postId: number, body: string){
        this.postId = postId;
        this.body = body;
    }
}