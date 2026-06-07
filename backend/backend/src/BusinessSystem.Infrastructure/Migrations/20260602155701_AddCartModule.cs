using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCartModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderDate",
                table: "Orders",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Orders",
                newName: "OrderDate");
        }
    }
}
