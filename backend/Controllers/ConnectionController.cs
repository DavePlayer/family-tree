using family_tree_API.Dto;
using family_tree_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("connection")]
    [Authorize]
    public class ConnectionController : Controller

    {
        private readonly IConnectionService _connectionService;

        public ConnectionController(IConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        [HttpPost("addconnection")]
        public IActionResult AddConnection([FromBody] ConnectionDto dto)
        {
            
            return Ok(_connectionService.AddConnection(dto));
        }

        [HttpPost("editconnection")]
        public IActionResult editConnection([FromBody] Models.Connection con)
        {
            
            return Json(_connectionService.editConnection(con));
        }
    }
}
