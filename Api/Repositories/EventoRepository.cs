using System.Linq;
using System.Threading.Tasks;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class EventoRepository : RepositorioGenerico<Evento>, IEvento
    {
        private readonly Contexto _contexto;

        public EventoRepository(Contexto contexto) : base(contexto)
        {
            _contexto = contexto;
            _contexto.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _contexto.Eventos.Include(c => c.Lotes)
                                                        .Include(c => c.Redes);

            if (includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                             .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking().OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoAsyncById(int id, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _contexto.Eventos.Include(c => c.Lotes)
                                                        .Include(c => c.Redes);

            if (includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                             .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                         .OrderBy(c => c.Id)
                         .Where(c => c.Id == id);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Evento[]> GetEventoAsyncByTema(string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _contexto.Eventos.Include(c => c.Lotes)
                                                        .Include(c => c.Redes);

            if (includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                             .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking().OrderBy(c => c.Id)
                         .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }
      
    }
}