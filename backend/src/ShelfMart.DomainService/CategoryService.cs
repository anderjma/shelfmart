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

    public async Task<CategoryDto> CreateCategoryAsync(string name)
    {
        if (await _categoryRepository.ExistsByNameAsync(name))
        {
            throw new ShelfMart.Exceptions.BadRequestResponseException("Category already exists.");
        }

        var category = new ShelfMart.Domain.Entities.Category
        {
            CategoryId = Guid.NewGuid(),
            Name = name
        };

        await _categoryRepository.AddAsync(category);

        return new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name
        };
    }
}
