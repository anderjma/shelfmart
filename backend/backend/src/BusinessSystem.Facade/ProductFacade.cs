// Este archivo agrupa y simplifica las interacciones relativas al inventario para que puedan ser consumidas por los controladores.
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Facade;

// Esta clase delega las operaciones del catálogo de productos y asegura que los eventos se envíen al servicio de auditoría de ser necesario.
public class ProductFacade : IProductFacade
{
    private readonly IProductService _productService;

    public ProductFacade(IProductService productService)
    {
        _productService = productService;
    }

    // Este método actúa de intermediario para la obtención de todos los productos del servicio de dominio.
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        return await _productService.GetAllProductsAsync();
    }

    // Este método actúa de intermediario para la obtención paginada y filtrada de productos.
    public async Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category)
    {
        return await _productService.GetPaginatedProductsAsync(page, pageSize, search, category);
    }

    // Este método actúa de intermediario para la consulta individual de un producto hacia la capa de dominio.
    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        return await _productService.GetProductByIdAsync(id);
    }

    // Este método invoca el servicio de creación de productos con el modelo proporcionado por el cliente.
    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        return await _productService.CreateProductAsync(dto);
    }

    // Este método comunica los cambios en las propiedades de un producto hacia el servicio subyacente.
    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        return await _productService.UpdateProductAsync(id, dto);
    }

    // Este método solicita la eliminación definitiva de un elemento de inventario a través de la interfaz de dominio.
    public async Task DeleteProductAsync(Guid id)
    {
        await _productService.DeleteProductAsync(id);
    }
}
