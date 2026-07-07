using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
// This file acts as a facade to centralize the security, login, and token issuance flow.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Facade;

// This class simplifies controllers' interaction with the encryption and credential validation modules.
public class AuthFacade : IAuthFacade
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthFacade(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    // This method masks the registration flow by creating a user from the form and invoking its persistence.
    public async Task<UserDto> RegisterAsync(LoginRequestDto request)
    {
        var user = new User
        {
            Username = request.Username,
            Name = request.Username,
            Email = $"{request.Username}@company.com"
        };

        return await _userService.RegisterCustomerAsync(user, request.Password);
    }

    // This method verifies the user's identity and issues a valid signed JWT for the current session.
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
