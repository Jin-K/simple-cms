using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SimpleCRM.Data.Migrations
{
    public partial class v100sqlite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserCode = table.Column<string>(nullable: false),
                    Login = table.Column<string>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "datetime('now')"),
                    LastConnection = table.Column<DateTime>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Labels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "datetime('now')"),
                    Custom = table.Column<int>(nullable: false, defaultValueSql: "0")
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Entities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "datetime('now')"),
                    Custom = table.Column<int>(nullable: false, defaultValueSql: "0")
                        .Annotation("Sqlite:Autoincrement", true),
                    LabelId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Entities_Labels_LabelId",
                        column: x => x.LabelId,
                        principalTable: "Labels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[] { 1, new DateTime(2018, 8, 16, 1, 26, 41, 959, DateTimeKind.Local), 0, "Sociétés" });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[] { 2, new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local), 0, "Contacts" });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[] { 3, new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local), 0, "Projets" });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[] { 4, new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local), 0, "Documents" });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[] { 5, new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local), 0, "Actions" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[] { 10, new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local), 0, 1, "Companies" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[] { 11, new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local), 0, 2, "Contacts" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[] { 20, new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local), 0, 3, "Projects" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[] { 31, new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local), 0, 4, "Documents" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[] { 32, new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local), 0, 5, "Actions" });

            migrationBuilder.CreateIndex(
                name: "IX_Entities_LabelId",
                table: "Entities",
                column: "LabelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Entities");

            migrationBuilder.DropTable(
                name: "Labels");
        }
    }
}
