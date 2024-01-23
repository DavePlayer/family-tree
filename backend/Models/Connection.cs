using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace family_tree_API.Models;

public partial class Connection
{
    public Guid Id { get; set; }

    public Guid FamilyTreeId { get; set; }

    public Guid From { get; set; }

    public Guid To { get; set; }
    [JsonIgnore]
    public virtual FamilyTree FamilyTree { get; set; } = null!;
    [JsonIgnore]
    public virtual Node FromNavigation { get; set; } = null!;
    [JsonIgnore]
    public virtual Node ToNavigation { get; set; } = null!;
}
