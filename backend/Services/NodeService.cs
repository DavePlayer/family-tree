using family_tree_API.Dto;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{

    public interface INodeService {

        public Node AddNode(NodeDto dto);
        public Node editNode(Node node);

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


        Node INodeService.AddNode(NodeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            //sprawdzenie czy członek rodziny i drzewo należą do osoby dodającej Nod'a
            FamilyMember? famMem = _context.FamilyMembers.Where(m => (m.Id == dto.FamilyMember && m.UserId.ToString() == userId)).FirstOrDefault();
            FamilyTree? famTree = _context.FamilyTrees.Where(t => (t.Id == dto.FamilyTree && t.UserId.ToString() == userId)).FirstOrDefault();

            if (famMem == null || famTree == null)
            {
                throw new Exception("Family tree or family member belongs to other user or does not exist");
            }

            Node node = new Node()
            {
                PosX = dto.PosX,
                PosY = dto.PosY
            };
            //XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD 
            node.FamilyMember = dto.FamilyMember;
            node.FamilyTree = dto.FamilyTree;

            _context.Nodes.Add(node);
            _context.SaveChanges();

            return node;
        }

        Node INodeService.editNode(Node node) {

            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyMember? fm = _context.FamilyMembers.Where(f=> f.Id == node.FamilyMember && f.UserId.ToString() == userId).FirstOrDefault();

            if(fm == null) {
                throw new Exception("There is no family member that node refers to");
            }

            _context.Nodes.Update(node);
            _context.SaveChanges();

            return node;
        }
    }
}
