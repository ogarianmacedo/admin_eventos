using System.Threading.Tasks;

namespace Api.Interfaces
{
    public interface IRepositorioGenerico<TEntity> where TEntity : class
    {
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void DeleteRanger<T>(T[] entity) where T : class;
        Task<bool> SaveChangesAsync();
    }
}