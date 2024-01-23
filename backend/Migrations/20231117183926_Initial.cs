using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace family_tree_API.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    email = table.Column<string>(name: "e-mail", type: "character varying(40)", maxLength: 40, nullable: false),
                    password = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("users_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "family_members",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    img_url = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    surname = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    birth_date = table.Column<DateOnly>(type: "date", nullable: true),
                    death_date = table.Column<DateOnly>(type: "date", nullable: true),
                    additional_data = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("family_members_pkey", x => x.id);
                    table.ForeignKey(
                        name: "user",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "family_trees",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    img_url = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("family_trees_pkey", x => x.id);
                    table.ForeignKey(
                        name: "users",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "nodes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    pos_x = table.Column<double>(type: "double precision", nullable: false),
                    pos_y = table.Column<double>(type: "double precision", nullable: false),
                    family_tree = table.Column<Guid>(type: "uuid", nullable: false),
                    family_member = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("nodes_pkey", x => x.id);
                    table.ForeignKey(
                        name: "member",
                        column: x => x.family_member,
                        principalTable: "family_members",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "tree",
                        column: x => x.family_tree,
                        principalTable: "family_trees",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "connections",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    family_tree_id = table.Column<Guid>(type: "uuid", nullable: false),
                    from = table.Column<Guid>(type: "uuid", nullable: false),
                    to = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("connections_pkey", x => x.id);
                    table.ForeignKey(
                        name: "from",
                        column: x => x.from,
                        principalTable: "nodes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "to",
                        column: x => x.to,
                        principalTable: "nodes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "tree",
                        column: x => x.family_tree_id,
                        principalTable: "family_trees",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_connections_family_tree_id",
                table: "connections",
                column: "family_tree_id");

            migrationBuilder.CreateIndex(
                name: "IX_connections_from",
                table: "connections",
                column: "from");

            migrationBuilder.CreateIndex(
                name: "IX_connections_to",
                table: "connections",
                column: "to");

            migrationBuilder.CreateIndex(
                name: "IX_family_members_user_id",
                table: "family_members",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_family_trees_user_id",
                table: "family_trees",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_nodes_family_member",
                table: "nodes",
                column: "family_member");

            migrationBuilder.CreateIndex(
                name: "IX_nodes_family_tree",
                table: "nodes",
                column: "family_tree");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "connections");

            migrationBuilder.DropTable(
                name: "nodes");

            migrationBuilder.DropTable(
                name: "family_members");

            migrationBuilder.DropTable(
                name: "family_trees");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
