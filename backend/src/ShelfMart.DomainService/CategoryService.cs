// This file contains the domain logic for exposing the category reference catalog.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;

namespace ShelfMart.DomainService;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    // This method retrieves and maps the full category catalog.
    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(c => new CategoryDto
        {
            CategoryId = c.CategoryId,
            Name = c.Name
        });
    }
}
