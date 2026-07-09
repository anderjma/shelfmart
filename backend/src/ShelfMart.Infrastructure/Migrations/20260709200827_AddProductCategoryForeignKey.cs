using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShelfMart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCategoryForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_Categories_Name",
                table: "Categories",
                column: "Name");

            // Backfill: any category value already in use by a product but missing from the
            // Categories reference table is inserted here, so existing data never violates the
            // foreign key added below. Without this, deploying against a database that already
            // has products (like this one) would fail.
            migrationBuilder.Sql(
                @"INSERT INTO ""Categories"" (""CategoryId"", ""Name"")
                  SELECT gen_random_uuid(), p.""Category""
                  FROM ""Products"" p
                  WHERE p.""Category"" IS NOT NULL
                    AND p.""Category"" <> ''
                    AND NOT EXISTS (
                        SELECT 1 FROM ""Categories"" c WHERE c.""Name"" = p.""Category""
                    )
                  GROUP BY p.""Category"";");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Category",
                table: "Products",
                column: "Category");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_Category",
                table: "Products",
                column: "Category",
                principalTable: "Categories",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_Category",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Category",
                table: "Products");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Categories_Name",
                table: "Categories");
        }
    }
}
