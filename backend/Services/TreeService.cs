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

        FamilyTree editTree(FamilyTree familyTree);
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


        //nie dodaje id drzewa
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
            if (tree.UserId.ToString() == userId)
            {
                deleteNodesByTreeId(treeId);
                _context.FamilyTrees.Remove(tree);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        FamilyTree ITreeService.editTree(FamilyTree familyTree)
        {
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            FamilyTree? tree = _context.FamilyTrees.Where(m => m.Id == familyTree.Id && m.UserId.ToString() == userId).FirstOrDefault();

            if (tree == null)
            {
                throw new Exception("There is no such family tree");
            }

            _context.FamilyTrees.Update(familyTree);
            _context.SaveChanges();

            return familyTree;
        }


    }
}