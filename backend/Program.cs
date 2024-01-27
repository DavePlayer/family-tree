using family_tree_API;
using family_tree_API.Dto;
using family_tree_API.Dto.Validators;
using family_tree_API.Exceptions;
using family_tree_API.Middleware;
using family_tree_API.Models;
using family_tree_API.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = "Bearer";
    option.DefaultChallengeScheme = "Bearer";
    option.DefaultScheme = "Bearer";
}).AddJwtBearer(opt => { 

    opt.RequireHttpsMetadata = false;
    opt.SaveToken = true;
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = "issuer",
        ValidAudience = "audience",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("randomowy string do generowania jwt")),
    };

});


builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IConnectionService, ConnectionService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<INodeService, NodeService>();
builder.Services.AddScoped<ITreeService, TreeService>();


builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddDbContext<FamilyTreeContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("familyTreeContext")));
builder.Services.AddScoped<ErrorHandlingMiddleware>();
builder.Services.AddScoped<StaticFileAuthorizationMiddleware>();

builder.Services.AddCors();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme { 
        In=ParameterLocation.Header,
        Description = "Please inser token",
        Name = "Authorization",
        Type=SecuritySchemeType.Http,
        BearerFormat="JWT",
        Scheme="bearer"
    
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
                Type=ReferenceType.SecurityScheme,
                Id="Bearer"
            }
        },
        new string[]{ }
        }
    });
});
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseMiddleware<StaticFileAuthorizationMiddleware>();
app.UseStaticFiles(
   new StaticFileOptions()
   {
       FileProvider = new PhysicalFileProvider(Path.Combine(Environment.CurrentDirectory, @"assets")),
       RequestPath = "/assets"
   }
);


app.MapControllers();

app.Run();