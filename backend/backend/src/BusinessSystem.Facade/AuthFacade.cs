using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
// Este archivo actúa como fachada para centralizar el flujo de seguridad, inicio de sesión y emisión de tokens.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Facade;

// Esta clase simplifica la interacción de los controladores con los módulos de cifrado y validación de credenciales.
public class AuthFacade : IAuthFacade
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthFacade(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    // Este método enmascara el flujo de registro creando un usuario a partir del formulario e invocando su persistencia.
    public async Task<UserDto> RegisterAsync(LoginRequestDto request)
    {
        var user = new User
        {
            Username = request.Username,
            Name = request.Username,
            Email = $"{request.Username}@empresa.com"
        };

        return await _userService.CreateUserAsync(user, request.Password);
    }

    // Este método verifica la identidad del usuario y emite un JWT firmado válido para la sesión actual.
    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userService.ValidateUserCredentialsAsync(request.Username, request.Password);

        var token = GenerateJwtToken(user!);
        var roles = user!.UserRoles.Select(ur => ur.Role.Name).ToList();

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            Roles = roles
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        foreach (var userRole in user.UserRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
        }

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
