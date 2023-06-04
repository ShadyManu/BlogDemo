namespace BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Comment
{
    public class CreateCommentDTO
    {
        public int PostId { get; set; }
        public string Body { get; set; } = string.Empty;
    }
}