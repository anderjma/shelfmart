using InventoryBackend.Dto;

namespace InventoryBackend.Facade.Interfaces;

public interface IUserFacade
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
}
