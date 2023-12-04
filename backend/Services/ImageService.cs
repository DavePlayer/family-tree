using family_tree_API.Exceptions;
using family_tree_API.Models;
using System.Security.Claims;

namespace family_tree_API.Services
{
    public interface IImageService
    {
        List<string> TreesImages();
        List<string> MembersImages();

        string Upload(IFormFile files, string tosaveid);
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
        List<string> IImageService.TreesImages()
        {
            throw new NotImplementedException();
        }
        List<string> IImageService.MembersImages()
        {
            throw new NotImplementedException();
        }

        string IImageService.Upload(IFormFile file, string toSaveId)
        {
            //TO DO 
            // jesli uploaduje zdjecie dla tego samego elementu, ale rozszerznie jest inne to nie nadpisuje

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
                 
                return("Supported: jpg, png");
                
            }


            string userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            //string userId = "2e3a4178-c4a6-4e66-9ecf-0bbc79d15404"; //only for testing 

            bool isFamilyMemberOrTreeAssigned = _context.FamilyMembers
        .Any(fm => fm.UserId.ToString() == userId && fm.Id.ToString() == toSaveId); // jesli probujemy przypisac zdjecie o id familimembersa lub famili tree ktorych uzytkownik nie jest wlascicielem

            if (!isFamilyMemberOrTreeAssigned)
            {
                isFamilyMemberOrTreeAssigned = _context.FamilyTrees
            .Any(ft => ft.UserId.ToString() == userId && ft.Id.ToString() == toSaveId);
            }

            if (!isFamilyMemberOrTreeAssigned) // check that user can upload a image with this id
            {
                throw new BadRequestException(
                    "Can't sign this image to this user, image id: " + toSaveId + "user id: " + userId,
                    new Exception());
            }




            //Find path
            
            var fileDirectoryPath = Path.Combine(Environment.CurrentDirectory, @"assets", userId);
            var filePath = Path.Combine(fileDirectoryPath, toSaveId + fileExtension);
            
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
            else {
                if (File.Exists(Path.Combine(fileDirectoryPath, toSaveId + ".png")))
                {
                    File.Delete((Path.Combine(fileDirectoryPath, toSaveId + ".png")));
                }

            }


            List<string> resault = new List<string>();

            if (file.Length > 0)
            {

                using (var stream = System.IO.File.Create(filePath))
                {
                    try
                    {
                        file.CopyTo(stream);
                        //mozna cos pogombinowa z CopyToAsync
                    }
                    catch (Exception ex)
                    {
                        throw new BadRequestException(ex.Message, new Exception());
                    }


                }
            }

            return (Path.Combine(userId, toSaveId));
        }
    }
}
