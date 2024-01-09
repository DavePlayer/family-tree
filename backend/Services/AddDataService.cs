using family_tree_API.Dto;
using family_tree_API.Models;
using FluentValidation.Validators;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IAddDataService
    {
        public FamilyMember AddFamilyMember(FamilyMemberDto dto);
        public FamilyTree addFamilyTree(FamilyTreeDto dto);
        public Node addNode(NodeDto dto);
        public Connection addConnection(ConnectionDto dto);

    }
    public class AddDataService : IAddDataService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public AddDataService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }
        public FamilyMember AddFamilyMember(FamilyMemberDto dto) {

            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var newMember = new FamilyMember() {
                UserId = Guid.Parse(userId),
                ImgUrl = dto.ImgUrl,
                Name = dto.Name,
                Surname = dto.Surname,
                BirthDate = dto.BirthDate,
                DeathDate = dto.DeathDate,
                AdditionalData = dto.AdditionalData,
            };

            _context.FamilyMembers.Add(newMember);
            _context.SaveChanges();

            return newMember;
            
        }

        public FamilyTree addFamilyTree(FamilyTreeDto dto)
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

        public Node addNode(NodeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            //sprawdzenie czy członek rodziny i drzewo należą do osoby dodającej Nod'a
            FamilyMember? famMem = _context.FamilyMembers.Where(m => (m.Id == dto.FamilyMember && m.UserId.ToString() == userId )).FirstOrDefault();
            FamilyTree? famTree = _context.FamilyTrees.Where(t=>(t.Id == dto.FamilyTree && t.UserId.ToString() == userId)).FirstOrDefault();
            
            if(famMem==null || famTree == null)
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

        public Connection addConnection(ConnectionDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            //sprawdza drzewo i nody do których odnosi się request
            FamilyTree? famTree = _context.FamilyTrees.Where(t => (t.Id == dto.FamilyTreeId && t.UserId.ToString() == userId)).FirstOrDefault();
            Node? nodeToId = _context.Nodes.Where(n => n.Id == dto.To ).FirstOrDefault();
            Node? nodeFromId = _context.Nodes.Where(n => n.Id == dto.From).FirstOrDefault();

            if (famTree == null)
            {
                throw new Exception("Tee does not exist or it does not belong to this user");
            }
            if (nodeToId == null || nodeFromId==null )
            {
                throw new Exception("One or both family members does not exist");
            }
            // sprawdza członków rodziny 
            FamilyMember? to = _context.FamilyMembers.Where(m => (m.Id == nodeToId.FamilyMember && m.UserId.ToString() == userId)).FirstOrDefault();
            FamilyMember? from = _context.FamilyMembers.Where(m => (m.Id == nodeFromId.FamilyMember && m.UserId.ToString() == userId)).FirstOrDefault();

            if (to == null || from == null)
            {
                throw new Exception("One or both family members does not belong to this user");
            }

            Connection connection = new Connection() { 
                FamilyTreeId = dto.FamilyTreeId,
                To = dto.To,
                From = dto.From
            };

            _context.Connections.Add(connection);
            _context.SaveChanges();

            return connection;
        }

    }
}
