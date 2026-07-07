using ShelfMart.Domain.Entities;

namespace ShelfMart.DomainService.Interfaces;

// This file abstracts the data access mechanism for the category reference catalog.
public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
}
