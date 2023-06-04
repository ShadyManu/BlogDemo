namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service
{
    public class GetClaimsService : IGetClaimsService
    {
        private readonly IHttpContextAccessor _http;

        // Costruttore per le dipendenze
        public GetClaimsService(IHttpContextAccessor httpContextAccessor)
        {
            _http = httpContextAccessor;
        }


        // Recupera i Claims (Id e Username) dal Bearer Token presente nell'header della request
        public ClaimsDTO GetMyClaims()
        {
            int idLogged = int.Parse(_http.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            string usernamelLogged = _http.HttpContext!.User.FindFirst(ClaimTypes.Name)!.Value.ToString();
            return new ClaimsDTO(){
                IdLogged = idLogged,
                UsernamelLogged = usernamelLogged
            };
        }
        
    }
}