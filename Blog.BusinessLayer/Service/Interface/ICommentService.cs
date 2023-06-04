namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service.Interface
{
    public interface ICommentService
    {
        Task<ServiceResponse<GetCommentDTO>> CreateComment(CreateCommentDTO createCommentDTO);
        Task<ServiceResponse<List<GetCommentDTO>>> GetCommentsByPost(int postId);
    }
}