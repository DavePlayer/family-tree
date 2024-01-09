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
        private readonly IDeleteDataService _deleteDataService;
        public DataController(IDeleteDataService deleteDataService)
        {
            _deleteDataService = deleteDataService;
        }

        [Route("trees")]
        [HttpGet("gettrees")]
        public IActionResult GetUserTrees()
        {
            return Json(_deleteDataService.UserFamilyTrees());
        }




        [HttpGet("getmembers")]
        public IActionResult GetUserMembers()
        {
            return Json(_deleteDataService.UserFamilyMembers());
        }

        [HttpGet("gettreesnames")]
        public IActionResult GetUserTreesNames() {
            return Json(_deleteDataService.UserFamilyTreesNames());
        }

        [HttpDelete("deletefamilymember")]
        public IActionResult DeleteFamilyMember(String id) {
            if (_deleteDataService.deletePerson(id))
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("deletetree")]
        public IActionResult DeleteTree(String id)
        {
            if (_deleteDataService.deleteTreeById(id))
            {
                return Ok();
            }
            return BadRequest();
        }



        [HttpPost()]
    }
}
