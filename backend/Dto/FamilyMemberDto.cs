using family_tree_API.Models;

namespace family_tree_API.Dto
{
    public class FamilyMemberDto
    {
        public string? ImgUrl { get; set; }

        public string? Name { get; set; }

        public string? Surname { get; set; }

        public DateOnly? BirthDate { get; set; }

        public DateOnly? DeathDate { get; set; }

        public string? AdditionalData { get; set; }
    }
}
