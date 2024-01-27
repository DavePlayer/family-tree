using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace family_tree_API.Migrations
{
    /// <inheritdoc />
    public partial class add_status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "family_members",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "family_members");
        }
    }
}
