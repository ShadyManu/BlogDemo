namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service
{
    public class PostService : IPostService
    {
        private readonly IMapper _mapper;
        private readonly IGetClaimsService _claims;
        private readonly DataContext _context;

        // Costruttore per le dipendenze
        public PostService(IMapper mapper, IGetClaimsService getClaimsService, DataContext context)
        {
            _mapper = mapper;
            _claims = getClaimsService;
            _context = context;
        }


        // Crea un nuovo Post, settando come userId quello che è loggato in quel momento, leggendolo dai Claims della JWT
        public async Task<ServiceResponse<GetPostDTO>> CreatePost(CreatePostDTO createPostDTO)
        {
            ServiceResponse<GetPostDTO> response = new ServiceResponse<GetPostDTO>();
            if(!CheckPostValid(createPostDTO.Title, createPostDTO.Body)){
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "Invalid title or body.";
                return response;
            }

            try{
                Post post = _mapper.Map<Post>(createPostDTO);
                post.UserId = _claims.GetMyClaims().IdLogged;
                var result = await _context.Posts.AddAsync(post);
                _context.SaveChanges();

                response.Data = _mapper.Map<GetPostDTO>(await _context.Posts
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Id == result.Entity.Id));
                    
                response.StatusCode = HttpStatusCode.Created;
                response.Message = "Post successfully created.";
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Prende tutti i Post disponibili dal database
        public async Task<ServiceResponse<List<GetPostDTO>>> GetAllPosts()
        {
            ServiceResponse<List<GetPostDTO>> response = new ServiceResponse<List<GetPostDTO>>();
            try{
                response.Data = _mapper.Map<List<GetPostDTO>>(await _context.Posts.Include(p => p.User).ToListAsync());
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Restituisce un Post filtrato per la sua Primary Key (ID)
        public async Task<ServiceResponse<GetPostDTO>> GetPostById(int id)
        {
            ServiceResponse<GetPostDTO> response = new ServiceResponse<GetPostDTO>();

            try{
                response.Data = _mapper.Map<GetPostDTO>(await _context.Posts
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Id == id));
                    
                if(response.Data == null){
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.Message = $"Post with ID: {id} Not Found.";
                }
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Controlla se il titolo ed il body del post sono validi oppure null
        private bool CheckPostValid(string title, string body){
            if(title == "" || title == string.Empty || title == null) return false; 
            else if(body == "" || body == string.Empty || body == null) return false;
            else return true;
        }
    }
}