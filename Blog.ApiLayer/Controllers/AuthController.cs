

namespace BackEnd_BlogDemo.Blog.ApiLayer.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Costruttore per le dipendenze
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        // API Endpoint per la REGISTRAZIONE. Non serve l'autenticazione (ne autorizzazione) per avere accesso.
        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<ServiceResponse<bool>>> Register(RegisterDTO registerDTO){
            ServiceResponse<bool> response = await _authService.Register(registerDTO);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode };
        }


        // API Endpoint per il LOGIN. Non serve l'autenticazione (ne autorizzazione) per avere accesso.
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<ServiceResponse<string>>> Login(LoginDTO loginDTO){
            ServiceResponse<string> response = await _authService.Login(loginDTO);
            return new ObjectResult(response) {StatusCode = (int) response.StatusCode};
        }

    }
}