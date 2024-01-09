namespace family_tree_API.Dto
{
    public class ConnectionDto
    {
        public Guid FamilyTreeId { get; set; }

        public Guid From { get; set; }

        public Guid To { get; set; }
    }
}
