using System;
using System.Collections.Generic;

namespace family_tree_API.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string EMail { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();

    public virtual ICollection<FamilyTree> FamilyTrees { get; set; } = new List<FamilyTree>();
}
