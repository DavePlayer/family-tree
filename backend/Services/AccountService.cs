using family_tree_API.Dto;
using family_tree_API.Models;
using Microsoft.AspNetCore.Identity;

namespace family_tree_API.Services
{
    public interface IAccountService {

        void RegisterUser(RegisterUserDto dto);
    }
    public class AccountService : IAccountService
    {
        private readonly FamilyTreeContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        public AccountService(FamilyTreeContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }
        public void RegisterUser(RegisterUserDto dto) {
            var newUser = new User() { 
                EMail = dto.Email,
                Name = dto.Name,
                Password = dto.Password,
            };
            var hashedPassword = _passwordHasher.HashPassword(newUser, dto.Password);
            newUser.Password = hashedPassword;
            _context.Users.Add(newUser);
            _context.SaveChanges();

        }
    }
}
