using System;
using System.Collections.Generic;

namespace ShelfMart.Dto;

// This generic class carries the paginated results along with their associated metadata.
public class PaginatedResultDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
