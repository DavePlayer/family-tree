﻿using family_tree_API.Dto;
using family_tree_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace family_tree_API.Controllers
{
    [Route("api/account")]
    [ApiController]

    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] RegisterUserDto dto)
        {
            _accountService.RegisterUser(dto);
            return Ok();
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            string token = _accountService.GenerateJwt(dto);
            return Ok(token);
        }

        [HttpDelete("deleteuser")]
        public IActionResult DeleteUser()
        {
            if (_accountService.DeleteUser())
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("validatejwt")]
        public IActionResult validateJWT(string jwt)
        {
            if (_accountService.validateJWT(jwt))
            {
                return Ok("Token is ok");
            }
            return BadRequest("Token is not valid");
        }
    }
}
