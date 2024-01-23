using family_tree_API.Models;

namespace family_tree_API.Dto
{
    public class FamilyTreeDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; } = null!;

        public string? ImgUrl { get; set; }

    }

}
