using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Api.DTO
{
    public class EventoDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage="Insira um {0}. Campo obrigatório!")]
        [StringLength(100, MinimumLength=5, ErrorMessage="Local deve ser entre 5 e 100 caracteres!")]
        public string Local { get; set; }

        public string DataEvento { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Tema { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        [Range(5, 500, ErrorMessage="Quantidade deve ser entre 5 e 500!")]
        public int QtdPessoas { get; set; }

        public string ImagemUrl { get; set; }
        
        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Telefone { get; set; }

        [EmailAddress]
        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Email { get; set; }

        public string Lote { get; set; }

        public List<LoteDTO> Lotes { get; set; }

        public List<RedeDTO> Redes { get; set; }
        
        public List<PalestranteDTO> Palestrantes { get; set; }
    }
}