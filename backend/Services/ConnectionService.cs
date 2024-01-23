using family_tree_API.Dto;
using family_tree_API.Models;
using System.Security.Claims;
namespace family_tree_API.Services
{

    public interface IConnectionService {

        public Connection AddConnection(ConnectionDto dto);
        public Connection editConnection(Connection con);

    }

    public class ConnectionService : IConnectionService
    {

        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public ConnectionService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }



        Connection IConnectionService.AddConnection(ConnectionDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            //sprawdza drzewo i nody do których odnosi się request
            FamilyTree? famTree = _context.FamilyTrees.Where(t => (t.Id == dto.FamilyTreeId && t.UserId.ToString() == userId)).FirstOrDefault();
            Node? nodeToId = _context.Nodes.Where(n => n.Id == dto.To).FirstOrDefault();
            Node? nodeFromId = _context.Nodes.Where(n => n.Id == dto.From).FirstOrDefault();

            if (famTree == null)
            {
                throw new Exception("Tee does not exist or it does not belong to this user");
            }
            if (nodeToId == null || nodeFromId == null)
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

            Connection connection = new Connection()
            {
                Id = Guid.NewGuid(),
                FamilyTreeId = dto.FamilyTreeId,
                To = dto.To,
                From = dto.From
            };

            _context.Connections.Add(connection);
            _context.SaveChanges();

            return connection;
        }

        Connection IConnectionService.editConnection(Connection con)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyTree? famTree = _context.FamilyTrees.Where(t => (t.Id == con.FamilyTreeId && t.UserId.ToString() == userId)).FirstOrDefault();
            Node? nodeToId = _context.Nodes.Where(n => n.Id == con.To).FirstOrDefault();
            Node? nodeFromId = _context.Nodes.Where(n => n.Id == con.From).FirstOrDefault();

            if (famTree == null)
            {
                throw new Exception("Tee does not exist or it does not belong to this user");
            }
            if (nodeToId == null || nodeFromId == null)
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
            _context.Connections.Update(con);
            _context.SaveChanges();
            return con;
        }
    }
}
