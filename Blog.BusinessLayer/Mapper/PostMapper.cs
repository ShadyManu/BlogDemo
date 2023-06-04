namespace BackEnd_BlogDemo.Blog.BusinessLayer.Mapper
{
    public class PostMapper : Profile
    {
        public PostMapper()
        {
            CreateMap<CreatePostDTO,Post>();

            CreateMap<Post, GetPostDTO>()
                .ForMember(o => o.Author, s => s.MapFrom(source => source.User.AuthorName));
        }
    }
}