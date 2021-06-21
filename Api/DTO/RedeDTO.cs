using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Api.DTO
{
    public class RedeDTO
    {
        public int Id  { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Nome { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string UrlRede { get; set; }

        public List<EventoDTO> Eventos { get; set; }
        
        public List<PalestranteDTO> Palestrantes { get; set; }
    }
}