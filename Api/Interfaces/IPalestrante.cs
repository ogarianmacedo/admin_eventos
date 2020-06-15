using System.Threading.Tasks;
using Api.Models;

namespace Api.Interfaces
{
    public interface IPalestrante : IRepositorioGenerico<Palestrante>
    {
        Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false);
        Task<Palestrante> GetPalestranteAsyncById(int id, bool includeEventos = false);
        Task<Palestrante[]> GetPalestranteAsyncByNome(string nome, bool includeEventos = false);
    }
}