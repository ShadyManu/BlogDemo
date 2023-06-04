namespace BackEnd_BlogDemo.Blog.BusinessLayer.Mapper
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, GetUserDTO>();
            
            CreateMap<RegisterDTO, User>();
        }
    }
}