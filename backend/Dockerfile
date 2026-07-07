# Stage 1: build and publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/ShelfMart.Api/ShelfMart.Api.csproj src/ShelfMart.Api/
COPY src/ShelfMart.Domain/ShelfMart.Domain.csproj src/ShelfMart.Domain/
COPY src/ShelfMart.DomainService/ShelfMart.DomainService.csproj src/ShelfMart.DomainService/
COPY src/ShelfMart.Dto/ShelfMart.Dto.csproj src/ShelfMart.Dto/
COPY src/ShelfMart.Exceptions/ShelfMart.Exceptions.csproj src/ShelfMart.Exceptions/
COPY src/ShelfMart.Facade/ShelfMart.Facade.csproj src/ShelfMart.Facade/
COPY src/ShelfMart.Infrastructure/ShelfMart.Infrastructure.csproj src/ShelfMart.Infrastructure/

RUN dotnet restore src/ShelfMart.Api/ShelfMart.Api.csproj

COPY src/ src/

RUN dotnet publish src/ShelfMart.Api/ShelfMart.Api.csproj -c Release -o /app/publish --no-restore

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ShelfMart.Api.dll"]
