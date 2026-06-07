# Etapa 1: Compilación
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copiar archivos de proyectos para restaurar dependencias
COPY src/BusinessSystem.Api/BusinessSystem.Api.csproj src/BusinessSystem.Api/
COPY src/BusinessSystem.Domain/BusinessSystem.Domain.csproj src/BusinessSystem.Domain/
COPY src/BusinessSystem.DomainService/BusinessSystem.DomainService.csproj src/BusinessSystem.DomainService/
COPY src/BusinessSystem.Dto/BusinessSystem.Dto.csproj src/BusinessSystem.Dto/
COPY src/BusinessSystem.Exceptions/BusinessSystem.Exceptions.csproj src/BusinessSystem.Exceptions/
COPY src/BusinessSystem.Facade/BusinessSystem.Facade.csproj src/BusinessSystem.Facade/
COPY src/BusinessSystem.Infrastructure/BusinessSystem.Infrastructure.csproj src/BusinessSystem.Infrastructure/

# Restaurar paquetes de NuGet
RUN dotnet restore src/BusinessSystem.Api/BusinessSystem.Api.csproj

# Copiar el resto de los archivos de código fuente
COPY src/ src/

# Compilar y publicar en modo Release
RUN dotnet publish src/BusinessSystem.Api/BusinessSystem.Api.csproj -c Release -o /publish

# Etapa 2: Imagen de ejecución (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /publish .

# Exponer el puerto de la API
EXPOSE 5000

# Variables de entorno por defecto para producción/contenedor
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "BusinessSystem.Api.dll"]
