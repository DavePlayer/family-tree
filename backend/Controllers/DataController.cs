using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;
using family_tree_API.Services;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("data")]
    [Authorize]
    public class DataController : Controller
    {
        private readonly IDataService _dataService;
        public DataController(IDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet("gettrees")]
        public IActionResult GetUserTrees()
        {
            return Json(_dataService.UserFamilyTrees());
        }

        [HttpGet("getmembers")]
        public IActionResult GetUserMembers()
        {
            return Json(_dataService.UserFamilyMembers());
        }

        [HttpGet("gettreesnames")]
        public IActionResult GetUserTreesNames() { 
            return Json(_dataService.UserFamilyTreesNames());
        }

        [HttpDelete("deletefamilymember")]
        public IActionResult DeleteFamilyMember(String id) {
            if (_dataService.deletePerson(id))
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
