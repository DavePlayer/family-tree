using family_tree_API.Dto;
using family_tree_API.Exceptions;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{

    public interface INodeService {
        public Node AddNode(NodeDto dto);
        public Node editNode(NodeDto dto);
        public Boolean deleteNode(string node_id);
    }
    public class NodeService : INodeService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public NodeService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }

        private void deleteConnectionByNodeId(String nodeId)
        {
            List<Connection> connections = _context.Connections.Where(c => (c.To.ToString() == nodeId || c.From.ToString() == nodeId)).ToList();
            if (connections.Count > 0)
            {
                _context.Connections.RemoveRange(connections);
                _context.SaveChanges();
            }
        }

        public bool deleteNode(string node_id)
        {
            Node? node = _context.Nodes.Where(n => n.Id.ToString() == node_id).FirstOrDefault();
            if (node != null)
            {
                deleteConnectionByNodeId(node.Id.ToString());
                _context.Nodes.Remove(node);
                _context.SaveChanges();
                return true;
            }
            else { 
                return false;
            }
        }

        Node INodeService.AddNode(NodeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            Node node = new Node()
            {
                Id = Guid.NewGuid(),
                PosX = dto.PosX,
                PosY = dto.PosY
            };
            
            node.FamilyMember = dto.FamilyMember;
            node.FamilyTree = dto.FamilyTree;

            _context.Nodes.Add(node);
            _context.SaveChanges();

            return node;
        }

        Node INodeService.editNode(NodeDto dto) {

            //find node to edit
            Node node =_context.Nodes.Where(e => e.Id == dto.Id).FirstOrDefault();

            if (node == null) {
                throw new Exception("There is no node with this id" + dto.Id);
            }



            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyMember? fm = _context.FamilyMembers.Where(f=> f.Id == dto.FamilyMember && f.UserId.ToString() == userId).FirstOrDefault();

            if(fm == null) {
                throw new Exception("There is no family member that node refers to");
            }

            FamilyTree? ft = _context.FamilyTrees.Where(f=> f.Id==dto.FamilyTree && f.UserId.ToString() == userId).FirstOrDefault();
            if (fm == null)
            {
                throw new Exception("Wrong tree ID");
            }

            node.FamilyMember = dto.FamilyMember;
            node.FamilyTree = dto.FamilyTree;
            node.PosX = dto.PosX;
            node.PosY = dto.PosY;

            _context.Nodes.Update(node);
            _context.SaveChanges();

            return node;
        }
    }
}
