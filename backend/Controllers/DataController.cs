using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;
using family_tree_API.Services;
using family_tree_API.Models;
using family_tree_API.Dto;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("data")]
    [Authorize]
    public class DataController : Controller
    {
        private readonly IDeleteDataService _deleteDataService;
        private readonly IAddDataService _addDataService;
        public DataController(IDeleteDataService deleteDataService, IAddDataService addDataService)
        {
            _deleteDataService = deleteDataService;
            _addDataService = addDataService;
        }

        [Route("trees")]
        [HttpGet("gettrees")]
        public IActionResult GetUserTrees()
        {
            return Json(_deleteDataService.UserFamilyTrees());
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

        //[HttpGet("gettreesnames")]
        //public IActionResult GetUserTreesNames() {
        //    return Json(_deleteDataService.UserFamilyTreesNames());
        //}



        [Route("members")]
        [HttpGet("getmembers")]
        public IActionResult GetUserMembers()
        {
            return Json(_deleteDataService.UserFamilyMembers());
        }
        [HttpDelete("deletefamilymember")]
        public IActionResult DeleteFamilyMember(String id) {
            if (_deleteDataService.deletePerson(id))
            {
                return Ok();
            }
            return BadRequest();
        }
        [HttpPost("addfamilymember")]
        public IActionResult AddFamilyMember(FamilyMemberDto dto)
        {

            return Ok("Brak implemetnacj");
        }




        [Route("node")]



        [Route("connection")]
        [HttpPost]
        public IActionResult AddConnection()
        {

            return Ok("Brak implemetnacj");
        }

    }
}
