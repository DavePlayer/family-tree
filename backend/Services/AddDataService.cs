using family_tree_API.Dto;
using family_tree_API.Models;
using Microsoft.EntityFrameworkCore;

namespace family_tree_API.Services
{
    public interface IAddDataService
    {
        public FamilyMember AddFamilyMember(FamilyMemberDto dto);
       

    }
    public class AddDataService
    {
        private readonly FamilyTreeContext _context;

        public AddDataService(FamilyTreeContext context)
        {
            _context = context;

        }
        public FamilyMember AddFamilyMember(FamilyMemberDto dto) { 
            var newMember  = new FamilyMember() {
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

    }
}
