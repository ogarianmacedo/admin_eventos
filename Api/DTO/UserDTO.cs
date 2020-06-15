using System.ComponentModel.DataAnnotations;

namespace Api.DTO
{
    public class UserDTO
    {
        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string UserName { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Email { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Password { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string FullName { get; set; }
    }
}