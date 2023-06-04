namespace BackEnd_BlogDemo.Blog.BusinessLayer.Service
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        // Costruttore per le dipendenze
        public AuthService(IConfiguration configuration, DataContext context, IMapper mapper)
        {
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
        }


        // Controlla se username e password sono validi, dopodichè legge lo user nel database e compara la password non criptata  alla
        // passwordHash + passwordSalt nel database, se tutto va a buon fine ritorna il Bearer Token (JWT).
        public async Task<ServiceResponse<string>> Login(LoginDTO loginDTO)
        {
            ServiceResponse<string> response = new ServiceResponse<string>();

             response = IsValidCredentials<string>(loginDTO.Username, loginDTO.Password);
            if(response.StatusCode != HttpStatusCode.OK) return response;

            try{
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == loginDTO.Username.ToLower());

                if(user == null){
                    response.Message = "Incorrect Username.";
                    return response;
                } else if (!VerifyPasswordHash(loginDTO.Password, user.PasswordHash, user.PasswordSalt)){
                    response.Message = "Incorrect Password.";
                    return response;
                } else response.Data = "Bearer " + CreateToken(user);
            } catch(Exception ex){
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Controlla se username e password sono validi e se non esiste già uno username con quel nome, dopodichè converte registerDTO
        // in uno User (entity) che andrà nel database. Quindi crea la password hashata e genera una passwordSalt univoca, settandole
        // allo User, così poi da inserirlo nel database e salvare i cambiamenti.
        public async Task<ServiceResponse<bool>> Register(RegisterDTO registerDTO)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            response = IsValidCredentials<bool>(registerDTO.Username, registerDTO.Password);
            if(response.StatusCode != HttpStatusCode.OK) return response; 

            if(registerDTO.AuthorName == "" || registerDTO.AuthorName == null || registerDTO.AuthorName == string.Empty){
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "Invalid Name.";
                return response;
            }

            try{
                response.Data = await UserExists(registerDTO.Username);
                if(response.Data == true){
                    response.Data = false;
                    response.StatusCode = HttpStatusCode.Conflict;
                    response.Message = "Username already exist.";
                    return response;
                } 

                User user = _mapper.Map<User>(registerDTO);
                CreatePasswordHash(registerDTO.Password, out byte[] passwordHash, out byte[] passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                await _context.AddAsync(user);
                response.Data = SaveChanges();
                response.StatusCode = HttpStatusCode.Created;
                response.Message = "User successfully registered.";
            } catch(Exception ex){
                response.Data = false;
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.Message;
            }
            return response;
        }


        // Salva cambiamenti sul database, ritornando un boolean
        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }


        // Metodo per controllare se l'username e la password sono validi oppure no, creando una response dinamica con i Generics
        // per poter usare il metodo in qualsiasi ServiceResponse di qualsiasi tipo T
        private ServiceResponse<T> IsValidCredentials<T>(string username, string password){
            ServiceResponse<T> isValid = new ServiceResponse<T>();
            if(username == null || username == "" || username == string.Empty){
                isValid.Message = "Username can't be null.";
                isValid.StatusCode = HttpStatusCode.BadRequest;
            } else if(password == null || password == "" || password == string.Empty){
                isValid.Message = "Password can't be null.";
                isValid.StatusCode = HttpStatusCode.BadRequest;
            }
            return isValid;
        }

      
        // Metodo per controllare se lo Username esiste già nel database oppure no
        private async Task<bool> UserExists(string username)
        {
            try{
                if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower())) return true;
                else return false;
            } catch(Exception){
                return false;
            }
        }


        // --------------------------------------------------------------------------------------------//
        //                              METODI SOLAMENTE PER LA JWT                                    //
        // --------------------------------------------------------------------------------------------//


        // Crea la password criptata in HMACSHA512, passando in ingresso una password lineare e creando una passwordSalt univoca. Essa 
        // viene creata randomicamente ogni volta che si istanzia la classe System.Security.Cryptography.HMACSHA512
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }


        // Controlla se la password lineare passata coincide con la password criptata incrociata con passwordSalt
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }


        // Crea il Token dello User, setta i Claims al suo interno (Id e Username), decide la durata della validità del token (Expires)
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var appSettingsToken = _configuration.GetSection("TokenKey").Value;
            if (appSettingsToken is null)
                throw new Exception("AppSettings Token is null.");

            SymmetricSecurityKey key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingsToken));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}