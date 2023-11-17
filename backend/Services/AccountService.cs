using family_tree_API.Dto;
using family_tree_API.Models;

namespace family_tree_API.Services
{
    public interface IAccountService {

        void RegisterUser(RegisterUserDto dto);
    }
    public class AccountService : IAccountService
    {
        private readonly FamilyTreeContext _context;
        public AccountService(FamilyTreeContext context)
        {
            _context = context;
        }
        public void RegisterUser(RegisterUserDto dto) {
            var newUser = new User() { 
                EMail = dto.Email,
                Name = dto.Name,
                Password = dto.Password,
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

        }
    }
}
