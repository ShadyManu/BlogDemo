namespace BackEnd_BlogDemo.Blog.DataAccessLayer.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public Post Post { get; set; } = null!;
        public int PostId { get; set; }
        public User User { get; set; } = null!;
        public int UserId { get; set; }   
        public string Body { get; set; } = string.Empty;
    }
}