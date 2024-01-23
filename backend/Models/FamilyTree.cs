using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace family_tree_API.Models;

public partial class FamilyTree
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = null!;

    public string? ImgUrl { get; set; }
    [JsonIgnore]
    public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();
    [JsonIgnore]
    public virtual ICollection<Node> Nodes { get; set; } = new List<Node>();
    [JsonIgnore]
    public virtual User User { get; set; } = null!;
}
