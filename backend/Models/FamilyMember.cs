using System;
using System.Collections.Generic;

namespace family_tree_API.Models;

public partial class FamilyMember
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string? ImgUrl { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public DateOnly? BirthDate { get; set; }

    public DateOnly? DeathDate { get; set; }

    public string? AdditionalData { get; set; }

    public virtual ICollection<Node> Nodes { get; set; } = new List<Node>();

    public virtual User User { get; set; } = null!;
}
