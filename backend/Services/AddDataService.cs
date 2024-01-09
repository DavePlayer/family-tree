using family_tree_API.Dto;
using family_tree_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IAddDataService
    {
        public FamilyMember AddFamilyMember(FamilyMemberDto dto);
        public FamilyTree addFamilyTree(FamilyTreeDto dto);



    }
    public class AddDataService : IAddDataService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public AddDataService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }
        public FamilyMember AddFamilyMember(FamilyMemberDto dto) {

            string userId= _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var newMember = new FamilyMember() {
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

        public FamilyTree addFamilyTree(FamilyTreeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            FamilyTree tree = new FamilyTree()
            {
                UserId = Guid.Parse(userId),
                Name = dto.Name,
                ImgUrl = dto.ImgUrl
            };

            _context.FamilyTrees.Add(tree);
            _context.SaveChanges();

            return tree;
        }

    }
}
