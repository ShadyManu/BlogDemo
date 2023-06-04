namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IGetClaimsService _getClaims;

        // Costruttore per le dipendenze
        public UserService(DataContext context ,IMapper mapper, IGetClaimsService getClaims)
        {
            _context = context;
            _mapper = mapper;
            _getClaims = getClaims;
        }


        // Restituisce uno User filtrato per la sua Primary Key (ID) recuperato dal TOKEN.
        public async Task<ServiceResponse<GetUserDTO>> GetUser()
        {
            ServiceResponse<GetUserDTO> response = new ServiceResponse<GetUserDTO>();

            try{
                int id = _getClaims.GetMyClaims().IdLogged;
                User? user = await _context.Users.FindAsync(id); 
                if(user != null) response.Data = _mapper.Map<GetUserDTO>(user);
                else {
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.Message = $"User with ID: {id} Not Found.";
                }
                return response;       
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
                return response;
            }    
        }
    }
    
}