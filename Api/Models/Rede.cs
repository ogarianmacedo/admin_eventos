namespace Api.Models
{
    public class Rede
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string UrlRede { get; set; }
        public int? EventoId { get; set; }
        public Evento Eventos { get; }
        public int? PalestranteId { get; set; }
        public Palestrante Palestrantes { get; }
    }
}