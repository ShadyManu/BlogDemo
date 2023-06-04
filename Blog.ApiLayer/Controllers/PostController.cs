namespace BackEnd_BlogDemo.Blog.ApiLayer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[Controller]")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;

        // Costruttore per le dipendenze
        public PostController(IPostService postService)
        {
            _postService = postService;
        }


        // API Endpoint per la CREAZIONE di un Post. Serve l'autenticazione per avere l'accesso.
        [HttpPost("CreatePost")]
        public async Task<ActionResult<ServiceResponse<GetPostDTO>>> CreatePost(CreatePostDTO createPostDTO){
            ServiceResponse<GetPostDTO> response = await _postService.CreatePost(createPostDTO);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }


        // API Endpoint per la READ di tutti i Post disponibili. Serve l'autenticazione per avere l'accesso.
        [HttpGet("GetAllPosts")]
        public async Task<ActionResult<ServiceResponse<List<GetPostDTO>>>> GetAllPosts(){
            ServiceResponse<List<GetPostDTO>> response = await _postService.GetAllPosts();
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }

        
        // API Endpoint per la READ di un post filtrato per Id. Serve l'autenticazione per avere l'accesso.
        [HttpGet("GetPost/{id}")]
        public async Task<ActionResult<ServiceResponse<GetPostDTO>>> GetPostById(int id){
            ServiceResponse<GetPostDTO> response = await _postService.GetPostById(id);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }

    }
}