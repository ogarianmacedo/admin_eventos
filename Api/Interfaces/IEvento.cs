using System.Threading.Tasks;
using Api.Models;

namespace Api.Interfaces
{
    public interface IEvento : IRepositorioGenerico<Evento>
    {
        Task<Evento[]> GetEventoAsyncByTema(string tema, bool includePalestrantes);
        Task<Evento[]> GetAllEventoAsync(bool includePalestrantes);
        Task<Evento> GetEventoAsyncById(int id, bool includePalestrantes);
    }
}