﻿using System.ComponentModel.DataAnnotations;

namespace family_tree_API.Dto
{
    public class RegisterUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }
}