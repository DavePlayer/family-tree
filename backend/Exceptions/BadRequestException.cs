﻿using System.Runtime.Serialization;

namespace family_tree_API.Exceptions
{
    internal class BadRequestException : Exception
    {
        public BadRequestException(string message):base(message)
        {
        }

    }
}