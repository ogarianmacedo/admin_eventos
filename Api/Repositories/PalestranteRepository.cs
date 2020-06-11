using System.Linq;
using System.Threading.Tasks;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class PalestranteRepository : RepositorioGenerico<Palestrante>, IPalestrante
    {
        private readonly Contexto _contexto;

        public PalestranteRepository(Contexto contexto) : base(contexto)
        {
            _contexto = contexto;
            _contexto.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<Palestrante[]> GetPalestranteAsyncByName(string nome, bool includeEventos = false)
        {
             IQueryable<Palestrante> query = _contexto.Palestrantes.Include(c => c.Redes);

            if(includeEventos)
            {
                query = query.Include(pe => pe.PalestranteEventos)
                             .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking().Where(p => p.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteAsyncById(int id, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _contexto.Palestrantes.Include(c => c.Redes);

            if(includeEventos)
            {
                query = query.Include(pe => pe.PalestranteEventos)
                             .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Nome).Where(p => p.Id == id);

            return await query.FirstOrDefaultAsync();
        }
    }
}