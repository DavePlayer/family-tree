﻿
namespace family_tree_API.Middleware
{
    public class ErrorHandlingMiddleware : IMiddleware
    {
        public Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            throw new NotImplementedException();
        }

        
    }
}
