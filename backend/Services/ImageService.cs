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
            //TO DO 

            string toSaveId = Guid.NewGuid().ToString();
            // id famili membersa ktory jest w bazie do testow 8e341e16-57ef-42d6-a879-590689f18e2b

            var fileExtension = Path.GetExtension(file.FileName);

            if (file.Length > 1000000)// if file is greater than 3MB
            {
                throw new BadRequestException(
                       "Image size is to high, max 1MB",
                       new Exception());
            }
            if (fileExtension != ".png" && fileExtension != ".jpg")
            {
                _contextAccessor.HttpContext.Response.StatusCode = 415;

                return ("Supported: jpg, png");

            }


            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            //string userId = "2e3a4178-c4a6-4e66-9ecf-0bbc79d15404"; //only for testing 

            //Wywalone zostało do ID jest generowane i poniższy kod nie ma sensu w takim przypadku
            /*
            bool isFamilyMemberAssigned = _context.FamilyMembers
            .Any(fm => fm.UserId.ToString() == userId && fm.Id.ToString() == toSaveId); // jesli probujemy przypisac zdjecie o id familimembersa lub famili tree ktorych uzytkownik nie jest wlascicielem

            bool isFamilyTreeAssigned = _context.FamilyTrees
            .Any(ft => ft.UserId.ToString() == userId && ft.Id.ToString() == toSaveId);

            // check that user can upload a image with this id
            if (!(isFamilyMemberAssigned || isFamilyTreeAssigned))
            {
                throw new BadRequestException(
                    "Can't sign this image to this user, image id: " + toSaveId + "user id: " + userId,
                    new Exception());
            }

            */
            

            //Find path
            var fileDirectoryPath = Path.Combine(Environment.CurrentDirectory, @"assets", userId);
            var filePath = Path.Combine(fileDirectoryPath, toSaveId + fileExtension);

            //Create a catalog if the user has not uploaded a photo
            if (!Directory.Exists(fileDirectoryPath))
            {
                Directory.CreateDirectory(fileDirectoryPath);
            }

            //Wywalone zostało do ID jest generowane i poniższy kod nie ma sensu w takim przypadku
            /*
            if (isFamilyTreeAssigned)
            {
                await addImageUrlToTrees(toSaveId, @"assets" + "/" + userId + "/" + toSaveId + fileExtension);
            }
            else if (isFamilyMemberAssigned)
            {
                await addImageUrlToMembers(toSaveId, @"assets" + "/" + userId + "/" + toSaveId + fileExtension);
            }
            */



            // deleting image with diffrent extension than is send
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
