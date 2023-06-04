var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(new[]{
    typeof(UserMapper).Assembly,
    typeof(PostMapper).Assembly,
    typeof(CommentMapper).Assembly
});

builder.Services.AddControllers();

// Aggiunta dei Service per la Dependency Injection con ciclo di vita Scoped, ossia che verrà generata una nuova istanza per
// ogni richesta http. Tutte le richieste HTTP che si verificano durante la stessa richiesta riceveranno la stessa istanza 
// di quella dipendenza. Alla fine, l'istanza verrà distrutta.
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGetClaimsService, GetClaimsService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IUserService, UserService>();

// Aggiunge la policy di nome MyPolicy, abilitando chiamate dall'inidirizzo http://localhost:4200, che è quello di Angular, 
// abilitando ogni metodo (PUT, GET, PATCH, etc) e abilitando ogni tipo di Header
builder.Services.AddCors(options => options.AddPolicy(name: "MyPolicy",
    policy => 
    {  
        policy
        //.WithOrigins("http://localhost:4200","https://localhost:7184")
        .AllowAnyOrigin()
        .AllowAnyMethod().AllowAnyHeader()
        //.AllowCredentials()
        ;
    }));

// Aggiunge il Contesto del Database, e specifica che si stra usando un Database In Memory
builder.Services.AddDbContext<DataContext>(options => options.UseInMemoryDatabase("BlogDemo"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Aggiunta dell'autenticazione e autorizzazione in Swagger (browser web)
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Autorizzazione di tipo Bearer token. (JWT -> JSON Web Token)",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Aggiunta del Secret della JWT, da aggiungere alla signature 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.ASCII
            .GetBytes(builder.Configuration.GetSection("TokenKey").Value!)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// Abilita la CORS di nome MyPolicy, definita poco più sopra
app.UseCors("MyPolicy");

app.UseHttpsRedirection();

// Aggiunge l'autenticazione della JWT
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();