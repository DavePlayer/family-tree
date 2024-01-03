using family_tree_API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IDataService {
        List<FamilyTree> UserFamilyTrees();
        List<FamilyMember> UserFamilyMembers();
        List<String> UserFamilyTreesNames();
        Boolean deletePerson(String personId);
    }
    public class DataService : IDataService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        public DataService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }

        void deleteConnectionByNodeId(String nodeId)
        {
            List<Connection> connections = _context.Connections.Where(c => (c.To.ToString() == nodeId || c.From.ToString() == nodeId)).ToList();
            if (connections.Count > 0)
            {
                _context.Connections.RemoveRange(connections);
            }
        }
        void deleteNodeByUserId(String userId)
        {
            Node node = _context.Nodes.Where(n => n.FamilyMember.ToString() == userId).FirstOrDefault();
            if (node != null)
            {
                deleteConnectionByNodeId(node.Id.ToString());
                _context.Nodes.Remove(node);
            }
        }

        void deleteFamilyMemberById(String familyMemberId)
        {
            FamilyMember member = _context.FamilyMembers.Where(m => m.Id.ToString() == familyMemberId).FirstOrDefault();
            if(member != null)
            {
                _context.FamilyMembers.Remove(member);
            }
        }

        void deleteNodeByTreeId(String treeId)
        {
            List <Node> nodes = _context.Nodes.Where(n => n.FamilyTree.ToString() == treeId).ToList();
            if(nodes.Count() > 0)
            {
                foreach (Node node in nodes)
                {
                    deleteConnectionByNodeId(node.Id.ToString());
                    deleteFamilyMemberById(node.FamilyMember.ToString());
                    _context.Nodes.Remove(node);
                }
            }
        }

        

        List<FamilyTree> IDataService.UserFamilyTrees()
        {    
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<FamilyTree> UserFamilyTrees = _context.FamilyTrees.Where(tree => tree.UserId.ToString() == userId).ToList();
            return UserFamilyTrees;
        }

        List<FamilyMember> IDataService.UserFamilyMembers()
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<FamilyMember> UserFamilyMembers = _context.FamilyMembers.Where(tree => tree.UserId.ToString() == userId).ToList();
            return UserFamilyMembers;
        }

        List<String> IDataService.UserFamilyTreesNames()
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            List <FamilyTree> UserFamilyMembers = _context.FamilyTrees.Where(tree => tree.UserId.ToString() == userId).ToList();
            List<String> TreesNames = UserFamilyMembers.Select(e=>e.Name).ToList();
            return TreesNames;
        }
        Boolean IDataService.deletePerson(String personId)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            FamilyMember person = _context.FamilyMembers.Where(m => m.Id.ToString() == personId).FirstOrDefault();
            if (person.UserId.ToString() == userId)
            {
                _context.FamilyMembers.Remove(person);
                deleteNodeByUserId(person.Id.ToString());
                return true;
            }
            return false; 
        }

        

        
    }
}
