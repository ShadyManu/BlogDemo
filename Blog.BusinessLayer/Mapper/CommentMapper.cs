namespace BackEnd_BlogDemo.Blog.BusinessLayer.Mapper
{
    public class CommentMapper : Profile
    {
        public CommentMapper()
        {
            CreateMap<Comment, GetCommentDTO>()
                .ForMember(o => o.CommentAuthor, s => s.MapFrom(source => source.User.AuthorName));

            CreateMap<CreateCommentDTO, Comment>();
        }
    }
}