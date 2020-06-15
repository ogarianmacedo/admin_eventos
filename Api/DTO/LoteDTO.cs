using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Api.DTO
{
    public class LoteDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public string Nome { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        public decimal Preco { get; set; }

        [Required(ErrorMessage="Campo {0} obrigatório!")]
        [Range(5, 500, ErrorMessage="Quantidade deve ser entre 5 e 500!")]
        public int Quantidade { get; set; }

        public string DataInicio { get; set; }
        
        public string DataFim { get; set; }

        public List<EventoDTO> Eventos { get; set; }
    }
}