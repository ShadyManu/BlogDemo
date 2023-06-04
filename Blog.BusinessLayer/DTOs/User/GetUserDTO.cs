namespace BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.User
{
    public class GetUserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
    }
}