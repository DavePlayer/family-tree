using family_tree_API.Dto;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IMemberService
    {
        public List<FamilyMember> GetUserFamilyMembers();
        public FamilyMember addFamilyMember(FamilyMemberDto dto);
        public Boolean DeleteMember(String personId);
    }
    public class MemberService:IMemberService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public MemberService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }

        public FamilyMember addFamilyMember(FamilyMemberDto dto)
        {

            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var newMember = new FamilyMember()
            {
                UserId = Guid.Parse(userId),
                ImgUrl = dto.ImgUrl,
                Name = dto.Name,
                Surname = dto.Surname,
                BirthDate = dto.BirthDate,
                DeathDate = dto.DeathDate,
                AdditionalData = dto.AdditionalData,
            };

            _context.FamilyMembers.Add(newMember);
            _context.SaveChanges();

            return newMember;

        }

        private void deleteConnectionByNodeId(String nodeId)
        {
            List<Connection> connections = _context.Connections.Where(c => (c.To.ToString() == nodeId || c.From.ToString() == nodeId)).ToList();
            if (connections.Count > 0)
            {
                _context.Connections.RemoveRange(connections);
            }
        }

        private void deleteNodeByUserId(String userId)
        {
            Node node = _context.Nodes.Where(n => n.FamilyMember.ToString() == userId).FirstOrDefault();
            if (node != null)
            {
                deleteConnectionByNodeId(node.Id.ToString());
                _context.Nodes.Remove(node);
            }
        }

        Boolean IMemberService.DeleteMember(String personId)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyMember person = _context.FamilyMembers.Where(m => m.Id.ToString() == personId).FirstOrDefault();
            if (person.UserId.ToString() == userId)
            {
                deleteNodeByUserId(person.Id.ToString());
                _context.FamilyMembers.Remove(person);
                return true;
            }
            return false;
        }

        List<FamilyMember> IMemberService.GetUserFamilyMembers()
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<FamilyMember> UserFamilyMembers = _context.FamilyMembers.Where(tree => tree.UserId.ToString() == userId).ToList();
            return UserFamilyMembers;
        }


    }
}
