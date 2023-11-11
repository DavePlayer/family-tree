using System;
using System.Collections.Generic;

namespace family_tree_API.Models;

public partial class Connection
{
    public Guid Id { get; set; }

    public Guid FamilyTreeId { get; set; }

    public Guid From { get; set; }

    public Guid To { get; set; }

    public virtual FamilyTree FamilyTree { get; set; } = null!;

    public virtual Node FromNavigation { get; set; } = null!;

    public virtual Node ToNavigation { get; set; } = null!;
}
