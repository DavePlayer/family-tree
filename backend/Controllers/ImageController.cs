using family_tree_API.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using family_tree_API.Services;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System.Security.Claims;

namespace family_tree_API.Controllers
{
    [ApiController]
    [Route("file")]
    [Authorize]
    public class ImageController : Controller
    {
        private readonly IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }


        [HttpGet("get_tree_images_url")]
        public IActionResult trees_images()
        {

            return Json(_imageService.TreesImages()); //tutaj przekaze id kto pyta o to  
        }

        [HttpGet("get_members_images_url")]
        public IActionResult members_images()
        {
            return Json(_imageService.MembersImages());
        }

       
        [HttpPost("uploadimage")]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile file, string Id)
        {
            
            return Json(_imageService.Upload(file, Id));
            
        }


    }
}
