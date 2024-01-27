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
    //[Authorize]
    public class ImageController : Controller
    {
        private readonly IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("uploadimage")]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile file)
        {
            
            return Json(await _imageService.Upload(file));
            
        }


    }
}
