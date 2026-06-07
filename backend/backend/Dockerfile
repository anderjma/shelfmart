# Etapa 1: Compilación
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copiar archivos de proyectos para restaurar dependencias
COPY src/InventoryBackend.Api/InventoryBackend.Api.csproj src/InventoryBackend.Api/
COPY src/InventoryBackend.Domain/InventoryBackend.Domain.csproj src/InventoryBackend.Domain/
COPY src/InventoryBackend.DomainService/InventoryBackend.DomainService.csproj src/InventoryBackend.DomainService/
COPY src/InventoryBackend.Dto/InventoryBackend.Dto.csproj src/InventoryBackend.Dto/
COPY src/InventoryBackend.Exceptions/InventoryBackend.Exceptions.csproj src/InventoryBackend.Exceptions/
COPY src/InventoryBackend.Facade/InventoryBackend.Facade.csproj src/InventoryBackend.Facade/
COPY src/InventoryBackend.Infrastructure/InventoryBackend.Infrastructure.csproj src/InventoryBackend.Infrastructure/

# Restaurar paquetes de NuGet
RUN dotnet restore src/InventoryBackend.Api/InventoryBackend.Api.csproj

# Copiar el resto de los archivos de código fuente
COPY src/ src/

# Compilar y publicar en modo Release
RUN dotnet publish src/InventoryBackend.Api/InventoryBackend.Api.csproj -c Release -o /publish

# Etapa 2: Imagen de ejecución (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /publish .

# Exponer el puerto de la API
EXPOSE 5000

# Variables de entorno por defecto para producción/contenedor
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "InventoryBackend.Api.dll"]
