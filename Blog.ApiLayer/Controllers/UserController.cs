namespace BackEnd_BlogDemo.Blog.ApiLayer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        // API Endpoint per la READ di uno USER filtrato per Id. Serve l'autenticazione per avere l'accesso.
        [HttpGet("GetUser")]
        public async Task<ActionResult<ServiceResponse<GetUserDTO>>> GetUser(){
            ServiceResponse<GetUserDTO> response = await _userService.GetUser();
            return new ObjectResult(response){StatusCode = (int) response.StatusCode};
        }
        
    }
}