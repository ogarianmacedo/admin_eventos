using System.Threading.Tasks;
using Api.Models;

namespace Api.Interfaces
{
    public interface IPalestrante : IRepositorioGenerico<Palestrante>
    {
        Task<Palestrante[]> GetPalestranteAsyncByName(string nome, bool includeEventos);
        Task<Palestrante> GetPalestranteAsyncById(int id, bool includeEventos);
    }
}