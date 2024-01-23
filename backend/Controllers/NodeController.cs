using family_tree_API.Dto;
using family_tree_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("node")]
    [Authorize]
    public class NodeController : Controller
    {

        private readonly INodeService _nodeService;
        public NodeController(INodeService nodeService)
        {
            _nodeService = nodeService;
        }

        [HttpPost("addnode")]
        public IActionResult AddNode([FromBody] NodeDto dto)
        {
            return Ok(_nodeService.AddNode(dto));
        }

        [HttpPost("editnode")]
        public IActionResult editNode([FromBody] NodeDto node)
        {
            return Ok(_nodeService.editNode(node));
        }
    }
}
