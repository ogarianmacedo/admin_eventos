using System.Collections.Generic;

namespace Api.Models
{
    public class Palestrante
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string ImagemUrl { get; set; }
        public List<Rede> Redes { get; set; }
        public List<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}