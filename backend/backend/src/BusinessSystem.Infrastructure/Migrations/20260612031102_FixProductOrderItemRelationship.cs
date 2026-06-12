using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixProductOrderItemRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductResourceId1",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ProductResourceId1",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "ProductResourceId1",
                table: "OrderItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProductResourceId1",
                table: "OrderItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductResourceId1",
                table: "OrderItems",
                column: "ProductResourceId1");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductResourceId1",
                table: "OrderItems",
                column: "ProductResourceId1",
                principalTable: "Products",
                principalColumn: "ProductResourceId");
        }
    }
}
