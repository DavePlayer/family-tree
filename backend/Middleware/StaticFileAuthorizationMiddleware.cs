
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

internal class StaticFileAuthorizationMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (!context.User.Identity.IsAuthenticated && context.Request.Path.Value.Contains("assets"))
        {
            context.Response.StatusCode = 404;
            return;
        }
        if (context.User.Identity.IsAuthenticated && context.Request.Path.Value.Contains("assets")){

            var user_id = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var secondSlashIndex = context.Request.Path.Value.IndexOf('/')+8;
            
            var path_id = context.Request.Path.Value.Substring(secondSlashIndex, user_id.Length); //if something went wrong, there is error handling middleware
            if (user_id != path_id)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Something went wrong :/");
                return;
            }
            else {

                 //context.Response.WriteAsync("dziala");
            } 
        }
        await next(context);
        Console.WriteLine("cs");
    }
}