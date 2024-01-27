using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace family_tree_API.Models;

public partial class Node
{
    public Guid Id { get; set; }

    public double PosX { get; set; }

    public double PosY { get; set; }

    public Guid? FamilyTree { get; set; }

    public Guid? FamilyMember { get; set; }
    [JsonIgnore]
    public virtual ICollection<Connection> ConnectionFromNavigations { get; set; } = new List<Connection>();
    [JsonIgnore]
    public virtual ICollection<Connection> ConnectionToNavigations { get; set; } = new List<Connection>();
    [JsonIgnore]
    public virtual FamilyMember FamilyMemberNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual FamilyTree FamilyTreeNavigation { get; set; } = null!;
}
