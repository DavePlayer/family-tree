using family_tree_API.Dto;
using family_tree_API.Exceptions;
using family_tree_API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace family_tree_API.Services
{
    public interface IAccountService
    {
        void RegisterUser(RegisterUserDto dto);

        string GenerateJwt(LoginDto dto);

        Boolean DeleteUser();
    }

    public class AccountService : IAccountService
    {
        private readonly FamilyTreeContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _contextAccessor;

        public AccountService(FamilyTreeContext context, IPasswordHasher<User> passwordHasher, IConfiguration configuration, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
            _contextAccessor = contextAccessor;
        }

        public void RegisterUser(RegisterUserDto dto)
        {
            var newUser = new User()
            {
                EMail = dto.Email,
                Name = dto.Name,
                Password = dto.Password,
            };
            var hashedPassword = _passwordHasher.HashPassword(newUser, dto.Password);
            newUser.Password = hashedPassword;
            _context.Users.Add(newUser);
            _context.SaveChanges();
        }

        string IAccountService.GenerateJwt(LoginDto dto)
        {
            
            var user = _context.Users.FirstOrDefault(u => u.EMail == dto.Email);
            if (user == null)
            {
                throw new BadRequestException("Invalid user name or password", new Exception());
            }

            var resault = _passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
            if (resault == PasswordVerificationResult.Failed)
            {
                throw new BadRequestException("Invalid user name or password", new Exception());
            }

            var claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSettings:Token").Value!));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                "issuer",
                "audience",
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
            );


            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }








        private void deleteFamilyMemberById(String familyMemberId)
        {
            FamilyMember member = _context.FamilyMembers.Where(m => m.Id.ToString() == familyMemberId).FirstOrDefault();
            if (member != null)
            {
                _context.FamilyMembers.Remove(member);
            }
        }
        private void deleteConnectionByNodeId(String nodeId)
        {
            List<Connection> connections = _context.Connections.Where(c => (c.To.ToString() == nodeId || c.From.ToString() == nodeId)).ToList();
            if (connections.Count > 0)
            {
                _context.Connections.RemoveRange(connections);
            }
        }
        

        private void deleteNodesByTreeId(String treeId)
        {
            List<Node> nodes = _context.Nodes.Where(n => n.FamilyTree.ToString() == treeId).ToList();
            if (nodes.Count() > 0)
            {
                foreach (Node node in nodes)
                {
                    deleteConnectionByNodeId(node.Id.ToString());
                    deleteFamilyMemberById(node.FamilyMember.ToString());
                    _context.Nodes.Remove(node);
                }
            }
        }

        private void deleteTree(FamilyTree tree)
        {
            deleteNodesByTreeId(tree.UserId.ToString());
            _context.FamilyTrees.Remove(tree);
        }

        Boolean IAccountService.DeleteUser()
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                User user = _context.Users.Where(u => u.Id.ToString() == userId).FirstOrDefault();
                if (user != null)
                {
                    List<FamilyTree> trees = _context.FamilyTrees.Where(t => t.UserId.ToString() == userId).ToList();
                    if (trees.Count > 0)
                    {
                        foreach (FamilyTree tree in trees)
                        {
                            deleteTree(tree);
                        }
                        _context.Users.Remove(user);
                        return true;
                    }
                }
                return false;
            }

            return false;
        }

    }
}