using System.Linq;
using System.Threading.Tasks;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class RepositorioGenerico<TEntity> : IRepositorioGenerico<TEntity> where TEntity : class
    {
        private readonly Contexto _contexto;

        public RepositorioGenerico(Contexto contexto)
        {
            _contexto = contexto;
            _contexto.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public void Add(TEntity entity)
        {
             _contexto.Add(entity);
        }

        public void Update(TEntity entity)
        {
            _contexto.Update(entity);
        }

        public void Delete(TEntity entity)
        {
           _contexto.Remove(entity);
        }

        public void DeleteRanger<T>(T[] entityArray) where T : class
        {
            _contexto.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _contexto.SaveChangesAsync()) > 0;
        }
    }
}