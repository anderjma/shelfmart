using ShelfMart.Dto;

namespace ShelfMart.DomainService.Interfaces;

// This file establishes the contract for retrieving the category reference catalog.
public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
}
