// This file carries a category catalog entry to the presentation layer.
using System;

namespace ShelfMart.Dto;

public class CategoryDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
}
