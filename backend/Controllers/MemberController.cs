using family_tree_API.Dto;
using family_tree_API.Models;
using family_tree_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("member")]
    [Authorize]
    public class MemberController : Controller
    {
        private readonly IMemberService _memberService;
        public MemberController(IMemberService memberService)
        {
            _memberService = memberService;
        }


        [HttpGet("getmembers")]
        public IActionResult GetUserMembers()
        {
            return Json(_memberService.GetUserFamilyMembers());
        }
        [HttpDelete("deletefamilymember")]
        public IActionResult DeleteFamilyMember(String id)
        {
            if (_memberService.DeleteMember(id))
            {
                return Ok();
            }
            return BadRequest();
        }


        [HttpPost("addfamilymember")]
        public IActionResult AddFamilyMember([FromBody] FamilyMemberDto dto)
        {
            return Json(_memberService.addFamilyMember( dto));
        }

    }
}
