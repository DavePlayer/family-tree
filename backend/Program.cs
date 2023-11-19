using family_tree_API.Dto;
using family_tree_API.Dto.Validators;
using Microsoft.EntityFrameworkCore;
using family_tree_API.Models;
using family_tree_API.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using family_tree_API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication().AddJwtBearer();



var authenticationSettings = new AuthenticationSettings();
//builder.Configuration.GetSection("Authentication").Bind(authenticationSettings);
//builder.Services.AddAuthentication(option =>
//{
//    option.DefaultAuthenticateScheme = "Bearer";
//    option.DefaultScheme = "Bearer";
//    option.DefaultChallengeScheme = "Bearer";
//}).AddJwtBearer

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddDbContext<FamilyTreeContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("familyTreeContext")));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
