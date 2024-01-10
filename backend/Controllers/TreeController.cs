using family_tree_API.Dto;
using family_tree_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("trees")]
    [Authorize]
    public class TreeController : Controller
    {

        private readonly ITreeService _treeService;

        public TreeController(ITreeService treeService)
        {
            _treeService = treeService;
        }

        [HttpGet("gettrees")]
        public IActionResult GetUserFamilyTrees()
        {
            return Json(_treeService.GetUserFamilyTrees());
        }
        [HttpDelete("deletetree")]
        public IActionResult DeleteTree(String id)
        {
            if (_treeService.DeleteTreeById(id))
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("addtree")]
        public IActionResult AddTree([FromBody] FamilyTreeDto dto)
        {
            
            return Ok(_treeService.AddFamilyTree(dto));
            
        }
    }
}
