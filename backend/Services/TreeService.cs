using family_tree_API.Dto;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface ITreeService {
        FamilyTree AddFamilyTree(FamilyTreeDto dto);

        List<FamilyTree> GetUserFamilyTrees();

        Boolean DeleteTreeById(String treeId);
    }
    public class TreeService:ITreeService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public TreeService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }


        FamilyTree ITreeService.AddFamilyTree(FamilyTreeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            FamilyTree tree = new FamilyTree()
            {
                UserId = Guid.Parse(userId),
                Name = dto.Name,
                ImgUrl = dto.ImgUrl
            };

            _context.FamilyTrees.Add(tree);
            _context.SaveChanges();

            return tree;
        }


        List<FamilyTree> ITreeService.GetUserFamilyTrees()
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<FamilyTree> UserFamilyTrees = _context.FamilyTrees.Where(tree => tree.UserId.ToString() == userId).ToList();
            return UserFamilyTrees;
        }


        private void deleteFamilyMemberById(String familyMemberId)
        {
            FamilyMember member = _context.FamilyMembers.Where(m => m.Id.ToString() == familyMemberId).FirstOrDefault();
            if (member != null)
            {
                _context.FamilyMembers.Remove(member);
            }
        }
        private void deleteConnectionByNodeId(String nodeId)
        {
            List<Connection> connections = _context.Connections.Where(c => (c.To.ToString() == nodeId || c.From.ToString() == nodeId)).ToList();
            if (connections.Count > 0)
            {
                _context.Connections.RemoveRange(connections);
            }
        }


        private void deleteNodesByTreeId(String treeId)
        {
            List<Node> nodes = _context.Nodes.Where(n => n.FamilyTree.ToString() == treeId).ToList();
            if (nodes.Count() > 0)
            {
                foreach (Node node in nodes)
                {
                    deleteConnectionByNodeId(node.Id.ToString());
                    deleteFamilyMemberById(node.FamilyMember.ToString());
                    _context.Nodes.Remove(node);
                }
            }
        }





        Boolean ITreeService.DeleteTreeById(String treeId)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            FamilyTree tree = _context.FamilyTrees.Where(m => m.Id.ToString() == treeId).FirstOrDefault();
            if (tree.UserId.ToString() == userId)
            {
                deleteNodesByTreeId(treeId);
                _context.FamilyTrees.Remove(tree);
                return true;
            }
            return false;
        }




    }
}
