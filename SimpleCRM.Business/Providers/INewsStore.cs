using System.Threading.Tasks;

namespace SimpleCRM.Business.Providers
{
    public interface INewsStore
    {
        Task AddGroup(string group);
    }
}