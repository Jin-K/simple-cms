using System.Threading.Tasks;

namespace SimpleCMS.Business.Providers
{
    public interface INewsStore
    {
        Task AddGroup(string group);
    }
}