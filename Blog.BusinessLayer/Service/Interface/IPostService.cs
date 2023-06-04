namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service.Interface
{
    public interface IPostService
    {
        Task<ServiceResponse<GetPostDTO>> CreatePost(CreatePostDTO createPostDTO);
        Task<ServiceResponse<List<GetPostDTO>>> GetAllPosts();
        Task<ServiceResponse<GetPostDTO>> GetPostById(int id); 
    }
}