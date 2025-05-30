using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DTOs.Auth
{
    public class ChangePasswordRequest
    {
        [Required]
        public string? UserId { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? NewPassword { get; set; }
    }
}