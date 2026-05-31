namespace InventoryBackend.Dto;

public class LoginResponseDto
{
    public required string Token { get; set; }
    public required string Username { get; set; }
    public List<string> Roles { get; set; } = [];
}
