namespace BackEnd_BlogDemo.Blog.ApiLayer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        // Costruttore per le dipendenze
        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }


        // API Endpoint per la CREAZIONE di un nuovo Commento. Serve l'autenticazione per avere l'accesso.
        [HttpPost("CreateComment")]
        public async Task<ActionResult<ServiceResponse<GetCommentDTO>>> CreateComment(CreateCommentDTO createCommentDTO){
            ServiceResponse<GetCommentDTO> response = await _commentService.CreateComment(createCommentDTO);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }


        // API Endpoint per la READ di tutti i commenti filtrati per Id del Post. Serve l'autenticazione per avere l'accesso.
        [HttpGet("GetCommentsByPost/{postId}")]
        public async Task<ActionResult<ServiceResponse<List<GetCommentDTO>>>> GetCommentsByPost(int postId){
            ServiceResponse<List<GetCommentDTO>> response = await _commentService.GetCommentsByPost(postId);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }

    }
}