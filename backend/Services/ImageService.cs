using family_tree_API.Exceptions;
using family_tree_API.Migrations;
using family_tree_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IImageService
    {
        Task<string> Upload(IFormFile files);
    }
    public class ImageService : IImageService
    {
        private readonly FamilyTreeContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        
        public ImageService(FamilyTreeContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
        }
        

        async Task<string> IImageService.Upload(IFormFile file)
        {
            string toSaveId = Guid.NewGuid().ToString();
            
            var fileExtension = Path.GetExtension(file.FileName);

            if (file.Length > 3000000)// if file is greater than 3MB
            {
                throw new BadRequestException(
                       "Image size is to high, max 9MB",
                       new Exception());
            }
            if (fileExtension != ".png" && fileExtension != ".jpg")
            {
                _contextAccessor.HttpContext.Response.StatusCode = 415;

                return ("Supported: jpg, png");

            }
            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            //Find path
            var fileDirectoryPath = Path.Combine(Environment.CurrentDirectory, @"assets", userId);
            var filePath = Path.Combine(fileDirectoryPath, toSaveId + fileExtension);

            //Create a catalog if the user has not uploaded a photo
            if (!Directory.Exists(fileDirectoryPath))
            {
                Directory.CreateDirectory(fileDirectoryPath);
            }

            if (fileExtension == ".png")
            {
                if (File.Exists(Path.Combine(fileDirectoryPath, toSaveId + ".jpg")))
                {
                    File.Delete((Path.Combine(fileDirectoryPath, toSaveId + ".jpg")));
                }

            }
            else
            {
                if (File.Exists(Path.Combine(fileDirectoryPath, toSaveId + ".png")))
                {
                    File.Delete((Path.Combine(fileDirectoryPath, toSaveId + ".png")));
                }

            }

            //saving file
            if (file.Length > 0)
            {
                using (var stream = System.IO.File.Create(filePath))
                {
                    try
                    {
                        file.CopyTo(stream);//mozna cos pogombinowa z CopyToAsync
                    }
                    catch (Exception ex)
                    {
                        throw new BadRequestException(ex.Message, new Exception());
                    }


                }
            }

            return (userId + "/" + toSaveId+fileExtension);
        }

        private async Task<int> addImageUrlToMembers(string memberId, string imgUrl) {

            var member = await _context.FamilyMembers.FindAsync(new Guid(memberId));
            

            if (member != null)
            {
                // Zaktualizuj adres URL obrazu
                member.ImgUrl = imgUrl;

                // Zapisz zmiany asynchronicznie i zwróć liczbę wpisów zmodyfikowanych w bazie danych
                return await _context.SaveChangesAsync();
            }
            else
            {
                // Obsługa przypadku, gdy użytkownik o określonym Id nie istnieje
                throw new BadRequestException("Saving changes to data base error", new Exception());
            }

        }
        private async Task<int> addImageUrlToTrees(string treeId, string imgUrl)
        {
            var member = await _context.FamilyTrees.FindAsync(new Guid(treeId));
            if (member != null)
            {
                // Zaktualizuj adres URL obrazu
                member.ImgUrl = imgUrl;

                // Zapisz zmiany asynchronicznie i zwróć liczbę wpisów zmodyfikowanych w bazie danych
                return await _context.SaveChangesAsync();
            }
            else
            {
                // Obsługa przypadku, gdy użytkownik o określonym Id nie istnieje
                throw new BadRequestException("Saving changes to data base error", new Exception());
            }
        }
    }
}
