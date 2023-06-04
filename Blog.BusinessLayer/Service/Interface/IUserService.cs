namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service.Interface
{
    public interface IUserService
    {
        Task<ServiceResponse<GetUserDTO>> GetUser();
    }
}