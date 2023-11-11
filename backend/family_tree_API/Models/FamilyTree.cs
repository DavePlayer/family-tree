using System;
using System.Collections.Generic;

namespace family_tree_API.Models;

public partial class FamilyTree
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = null!;

    public string? ImgUrl { get; set; }

    public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();

    public virtual ICollection<Node> Nodes { get; set; } = new List<Node>();

    public virtual User User { get; set; } = null!;
}
