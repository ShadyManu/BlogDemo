namespace BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Posts
{
    public class GetPostDTO
    {
        public int Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}