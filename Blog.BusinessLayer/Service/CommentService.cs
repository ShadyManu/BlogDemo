namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service
{
    public class CommentService : ICommentService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly IGetClaimsService _claims;


        // Costruttore per le dipendenze
        public CommentService(IMapper mapper, DataContext context, IGetClaimsService getClaimsService)
        {
            _mapper = mapper;
            _context = context;
            _claims = getClaimsService;
        }


        // Inserisce un nuovo commento con ForeignKey al Post in questione e allo User che ha scritto il commento. Controlla che
        // il body del Commento non è null e che esiste in effetti un Post con quell'ID. Prende l'Id di chi è loggato dai Claims
        public async Task<ServiceResponse<GetCommentDTO>> CreateComment(CreateCommentDTO createCommentDTO)
        {
            ServiceResponse<GetCommentDTO> response = new ServiceResponse<GetCommentDTO>();

            if(!IsBodyValid(createCommentDTO.Body)){
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "Body of the comment cannot be null.";
                return response;
            }

            try{
                if(await _context.Posts.AnyAsync(c => c.Id == createCommentDTO.PostId)){
                    Comment comment = _mapper.Map<Comment>(createCommentDTO);
                    comment.UserId = _claims.GetMyClaims().IdLogged;
                    var result = await _context.Comments.AddAsync(comment);
                    _context.SaveChanges();

                    response.Data = _mapper.Map<GetCommentDTO>(await _context.Comments
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == result.Entity.Id));          
                    response.StatusCode = HttpStatusCode.Created;     
                } else {
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.Message = $"Post with ID: {createCommentDTO.PostId} Not Found.";
                }
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Controlla prima se esiste un post con l'Id che arriva. Dopodichè controlla se ci sono o meno commenti associati a quel post.
        public async Task<ServiceResponse<List<GetCommentDTO>>> GetCommentsByPost(int postId)
        {
            ServiceResponse<List<GetCommentDTO>> response = new ServiceResponse<List<GetCommentDTO>>();

            try{
                if(await _context.Posts.AnyAsync(p => p.Id == postId)){
                    var result = await _context.Comments.Where(c => c.PostId == postId).Include(c => c.User).ToListAsync();
                    if(result.Count == 0){
                        response.Data = new List<GetCommentDTO>();
                        response.Message = $"There aren't any comments associated to PostId: {postId}.";
                        return response;
                    } else {
                        response.Data = _mapper.Map<List<GetCommentDTO>>(result);
                        return response;
                    }
                } else {
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.Message = $"Post with Id: {postId} Not Found.";
                    return response;
                }
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
                return response;
            }
        }


        // Controlle se il Body del commento c'è oppure se è vuoto.
        private bool IsBodyValid(string body){
            if(body == null || body == "" || body == string.Empty) return false;
            else return true;
        }
    }
}