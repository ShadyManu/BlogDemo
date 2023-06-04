namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service.Interface
{
    public interface IAuthService
    {
        Task<ServiceResponse<bool>> Register(RegisterDTO registerDTO);
        Task<ServiceResponse<string>> Login(LoginDTO loginDTO);
        bool SaveChanges();
    }
}