// This file groups and simplifies category-related interactions so they can be consumed by the controllers.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Facade;

public class CategoryFacade : ICategoryFacade
{
    private readonly ICategoryService _categoryService;

    public CategoryFacade(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // This method acts as an intermediary for retrieving the category catalog from the domain service.
    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        return await _categoryService.GetAllCategoriesAsync();
    }
}
