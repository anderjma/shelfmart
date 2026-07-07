using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using NSubstitute;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ShelfMart.UnitTests;

public class CategoryServiceTests
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly CategoryService _categoryService;

    public CategoryServiceTests()
    {
        _categoryRepository = Substitute.For<ICategoryRepository>();
        _categoryService = new CategoryService(_categoryRepository);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnMappedDtos()
    {
        // Arrange
        var categories = new List<Category>
        {
            new Category { Name = "General" },
            new Category { Name = "Electronics" }
        };
        _categoryRepository.GetAllAsync().Returns(categories);

        // Act
        var result = await _categoryService.GetAllCategoriesAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(c => c.Name == "General");
        result.Should().Contain(c => c.Name == "Electronics");
    }
}
