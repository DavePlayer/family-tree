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
        public IActionResult editConnection([FromBody] ConnectionDto dto)
        {

            return Json(_connectionService.editConnection(dto));
        }

        [HttpDelete ("deleteconnection")]
        public IActionResult deleteConnection(string id)
        {
            if (_connectionService.deleteConnection(id)) {
                return Ok(id);
            }
            return BadRequest();
            
        }
    }
}
