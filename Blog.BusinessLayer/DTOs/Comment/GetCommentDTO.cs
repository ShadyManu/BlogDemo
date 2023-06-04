namespace BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Comment
{
    public class GetCommentDTO
    {
        public int Id { get; set; }
        public string CommentAuthor { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}