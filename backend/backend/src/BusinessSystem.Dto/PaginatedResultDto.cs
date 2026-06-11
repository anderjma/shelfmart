using System;
using System.Collections.Generic;

namespace BusinessSystem.Dto;

// Esta clase genérica transporta los resultados paginados junto con sus metadatos asociados.
public class PaginatedResultDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
