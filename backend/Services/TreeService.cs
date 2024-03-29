﻿using family_tree_API.Dto;
using family_tree_API.Models;
using System;
using System.Security.Claims;

//DONE
//dodawanie drzewa działa
//usuwanie drzewa po id działa, nie wiem jak nody ktore były do tego drzewa itd

//TO DO
//zmiana nazwy drzewa
//nie pozwolenie dwoch drzew o tej samej nazwie (chyba ze ma byc to feature)
//
//....


namespace family_tree_API.Services
{
    public interface ITreeService
    {
        FamilyTree AddFamilyTree(FamilyTreeDto dto);

        List<FamilyTree> GetUserFamilyTrees();

        Boolean DeleteTreeById(String treeId);

        FamilyTree editTree(FamilyTreeDto dto);

        WholeTree getWholeTree(string treeId);
    }
    public class TreeService : ITreeService
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
                Id = Guid.NewGuid(),
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
                _context.SaveChanges();
            }
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
                    _context.SaveChanges();
                }
            }
        }





        Boolean ITreeService.DeleteTreeById(String treeId)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            FamilyTree tree = _context.FamilyTrees.Where(m => m.Id.ToString() == treeId).FirstOrDefault();
            if (tree.UserId.ToString().Equals(userId))
            {
                deleteNodesByTreeId(treeId);
                _context.FamilyTrees.Remove(tree);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        FamilyTree ITreeService.editTree(FamilyTreeDto dto)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyTree? tree = _context.FamilyTrees.Where(m => m.Id == dto.Id && m.UserId.ToString() == userId).FirstOrDefault();

            if (tree == null)
            {
                throw new Exception("There is no such family tree");
            }

            tree.Name = dto.Name;
            tree.ImgUrl = dto.ImgUrl;

            _context.FamilyTrees.Update(tree);
            _context.SaveChanges();

            return tree;
        }

        WholeTree ITreeService.getWholeTree(string treeId)
        {
            WholeTree tree =new WholeTree();
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            tree.familyTree = _context.FamilyTrees.Where(tree => tree.Id.ToString().Equals(treeId) && tree.UserId.ToString().Equals(userId)).FirstOrDefault();

            tree.nodes = _context.Nodes.Where(n => n.FamilyTree.ToString() == treeId).ToList();
            tree.connections = _context.Connections.Where(c => c.FamilyTreeId.ToString() == treeId).ToList();
            tree.members = new List<FamilyMember>();
            foreach (Node node in tree.nodes)
            {
                FamilyMember f = _context.FamilyMembers.Where(f => f.Id == node.FamilyMember).FirstOrDefault();
                if (f != null)
                {
                    
                    tree.members.Add(f);
                }
                
            }                   

            if (tree.members == null)
            {
                tree.members = Array.Empty<FamilyMember>().ToList();
            }

            if (tree.nodes == null)
            {
                tree.nodes = Array.Empty<Node>().ToList();
            }  

            if (tree.connections == null)
            {
                tree.connections = Array.Empty<Connection>().ToList();
            }

            return tree;
        }
    }
}
