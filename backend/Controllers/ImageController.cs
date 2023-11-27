using family_tree_API.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("file")]
    [Authorize]
    public class ImageController : Controller
    {
        public ImageController() { }

        
        [HttpPost("test")]
        public ActionResult Test() {
            return Ok();   
        }

        [HttpPost("upload")]
        public ActionResult Upload([FromForm] IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var rootPath = Directory.GetCurrentDirectory();
                var fileName = file.FileName;
                var fullPath = $"{rootPath}/PrivateFiles/{fileName}";
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok();
            }

            return Ok();
        }
       
        [HttpGet("get_urls")]
        public IActionResult GetImageUrls()
        {
            return Ok();
        }

        [HttpDelete("delete_image")]
        public IActionResult DeleteImage()
        {
            return Ok();
        }
    }
}
