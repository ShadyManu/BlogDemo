namespace BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Auth
{
    public class RegisterDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
    }
}