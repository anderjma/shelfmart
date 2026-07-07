// This file defines the facade design pattern applied to the category reference catalog.
using ShelfMart.Dto;

namespace ShelfMart.Facade.Interfaces;

public interface ICategoryFacade
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
}
