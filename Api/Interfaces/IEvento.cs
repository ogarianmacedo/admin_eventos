using System.Threading.Tasks;
using Api.Models;

namespace Api.Interfaces
{
    public interface IEvento : IRepositorioGenerico<Evento>
    {
        Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false);

        Task<Evento[]> GetEventoAsyncByTema(string tema, bool includePalestrantes = false);
        
        Task<Evento> GetEventoAsyncById(int id, bool includePalestrantes = false);
    }
}