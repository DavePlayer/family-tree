using family_tree_API.Models;
using Microsoft.EntityFrameworkCore;

namespace family_tree_API.Dto
{
    public class WholeTree
    {
        public FamilyTree familyTree { get; set; }

        public List<Node> nodes { get; set; }
        public List<Connection> connections { get; set; }
        public List<FamilyMember> members { get; set; }
    }
}
