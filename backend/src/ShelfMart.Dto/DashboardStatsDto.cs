// This file carries the typed metrics displayed on the administration dashboard.
using System.Collections.Generic;

namespace ShelfMart.Dto;

public class DashboardStatsDto
{
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
    public int LowStock { get; set; }
    public int TotalCustomers { get; set; }
    public List<SalesChartPointDto> SalesChart { get; set; } = new();
}

public class SalesChartPointDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Total { get; set; }
}
