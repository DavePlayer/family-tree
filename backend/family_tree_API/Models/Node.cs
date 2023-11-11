using System;
using System.Collections.Generic;

namespace family_tree_API.Models;

public partial class Node
{
    public Guid Id { get; set; }

    public double PosX { get; set; }

    public double PosY { get; set; }

    public Guid FamilyTree { get; set; }

    public Guid FamilyMember { get; set; }

    public virtual ICollection<Connection> ConnectionFromNavigations { get; set; } = new List<Connection>();

    public virtual ICollection<Connection> ConnectionToNavigations { get; set; } = new List<Connection>();

    public virtual FamilyMember FamilyMemberNavigation { get; set; } = null!;

    public virtual FamilyTree FamilyTreeNavigation { get; set; } = null!;
}
