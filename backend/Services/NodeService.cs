using family_tree_API.Dto;
using family_tree_API.Exceptions;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{

    public interface INodeService {

        public Node AddNode(NodeDto dto);
        public Node editNode(NodeDto dto);

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
            FamilyMember? famMem = _context.FamilyMembers.Single(m => (m.Id.Equals(dto.FamilyMember)));
            FamilyTree? famTree = _context.FamilyTrees.Where(t => t.Id == dto.FamilyTree).FirstOrDefault();

            if (famMem == null || !famMem.UserId.ToString().Equals(userId) || famTree == null || !famTree.UserId.ToString().Equals(userId))
            {
                throw new BadRequestException("Family tree or family member belongs to other user or does not exist", new Exception());
            }

            Node node = new Node()
            {
                Id = Guid.NewGuid(),
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
