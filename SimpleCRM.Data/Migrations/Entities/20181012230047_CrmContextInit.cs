using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SimpleCRM.Data.Migrations.Entities
{
    public partial class CrmContextInit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "auth");

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserCode = table.Column<string>(nullable: false),
                    Login = table.Column<string>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()"),
                    LastConnection = table.Column<DateTime>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Actions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()")
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
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()")
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
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Label = table.Column<string>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()"),
                    Custom = table.Column<int>(nullable: false, defaultValueSql: "0")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsGroups",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsItemEntities",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Author = table.Column<string>(nullable: false),
                    NewsGroup = table.Column<string>(nullable: false),
                    Header = table.Column<string>(nullable: true),
                    NewsText = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsItemEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    NormalizedName = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(nullable: true),
                    NormalizedUserName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    NormalizedEmail = table.Column<string>(nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    IsAdmin = table.Column<bool>(nullable: false),
                    DataEventRecordsRole = table.Column<string>(nullable: true),
                    SecuredFilesRole = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Widgets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()"),
                    ChartType = table.Column<string>(nullable: false),
                    _Labels = table.Column<string>(nullable: false),
                    _Colors = table.Column<string>(nullable: false),
                    _Options = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Widgets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                schema: "auth",
                columns: table => new
                {
                    RoleClaimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.RoleClaimId);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                schema: "auth",
                columns: table => new
                {
                    UserClaimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.UserClaimId);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                schema: "auth",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "auth",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.RoleId, x.UserId });
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                schema: "auth",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "Entities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()"),
                    Custom = table.Column<int>(nullable: false, defaultValueSql: "0"),
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
                table: "Actions",
                columns: new[] { "Id", "Created" },
                values: new object[] { 1, new DateTime(2018, 10, 13, 1, 0, 46, 664, DateTimeKind.Local) });

            migrationBuilder.InsertData(
                table: "Companies",
                columns: new[] { "Id", "Created", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2018, 10, 10, 1, 0, 46, 662, DateTimeKind.Local), "Intense Designing" },
                    { 2, new DateTime(2018, 10, 13, 1, 0, 46, 662, DateTimeKind.Local), "Jin-K Empire" }
                });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "Id", "Created", "FirstName", "LastName" },
                values: new object[,]
                {
                    { 16, new DateTime(2018, 10, 12, 19, 35, 46, 660, DateTimeKind.Local), "bon", "risoto" },
                    { 10, new DateTime(2018, 10, 12, 22, 5, 46, 660, DateTimeKind.Local), "zetest", "Kesako" },
                    { 9, new DateTime(2018, 10, 12, 22, 30, 46, 660, DateTimeKind.Local), "testing", "Rivera" },
                    { 8, new DateTime(2018, 10, 12, 22, 55, 46, 660, DateTimeKind.Local), "test", "test" },
                    { 7, new DateTime(2018, 10, 12, 23, 20, 46, 660, DateTimeKind.Local), "uezbf", "pzgp" },
                    { 6, new DateTime(2018, 10, 12, 23, 45, 46, 660, DateTimeKind.Local), "ffdb ", "dfggg" },
                    { 5, new DateTime(2018, 10, 13, 0, 10, 46, 660, DateTimeKind.Local), "uuj", "yhy" },
                    { 4, new DateTime(2018, 10, 13, 0, 35, 46, 660, DateTimeKind.Local), "sgs", "rg er g" },
                    { 2, new DateTime(2018, 8, 17, 9, 0, 0, 0, DateTimeKind.Unspecified), "Pablo", "Muñoz" },
                    { 11, new DateTime(2018, 10, 12, 21, 40, 46, 660, DateTimeKind.Local), "Super", "Mario" },
                    { 1, new DateTime(2018, 8, 16, 12, 30, 5, 237, DateTimeKind.Unspecified), "Angel", "Muñoz" },
                    { 13, new DateTime(2018, 10, 12, 20, 50, 46, 660, DateTimeKind.Local), "Pablo", "Escobar" },
                    { 14, new DateTime(2018, 10, 12, 20, 25, 46, 660, DateTimeKind.Local), "aodnbaz", "epangzeg" },
                    { 15, new DateTime(2018, 10, 12, 20, 0, 46, 660, DateTimeKind.Local), "encore des", "spaghetti" },
                    { 17, new DateTime(2018, 10, 12, 19, 10, 46, 660, DateTimeKind.Local), "Grosse", "caisse" },
                    { 3, new DateTime(2018, 10, 13, 1, 0, 46, 660, DateTimeKind.Local), "qrqrg", "gqzgq" },
                    { 12, new DateTime(2018, 10, 12, 21, 15, 46, 660, DateTimeKind.Local), "Kestu", "Veux" }
                });

            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Created", "Custom", "Label" },
                values: new object[,]
                {
                    { 1, new DateTime(2018, 10, 13, 1, 0, 46, 646, DateTimeKind.Local), 0, "Sociétés" },
                    { 4, new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), 0, "Documents" },
                    { 3, new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), 0, "Projets" },
                    { 2, new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), 0, "Contacts" },
                    { 5, new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), 0, "Actions" }
                });

            migrationBuilder.InsertData(
                table: "NewsGroups",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1L, "are" },
                    { 2L, "IT" },
                    { 3L, "sport" },
                    { 4L, "global" }
                });

            migrationBuilder.InsertData(
                table: "NewsItemEntities",
                columns: new[] { "Id", "Author", "Header", "NewsGroup", "NewsText" },
                values: new object[,]
                {
                    { 16L, "unknown", "Jin-K", "sport", "texte" },
                    { 15L, "unknown", "test", "IT", "testteqg" },
                    { 14L, "test", "que ?", "sport", "testons celà" },
                    { 13L, "test", "que ?", "IT", "testons celà" },
                    { 12L, "unknown", "que ?", "IT", "testons celà" },
                    { 11L, "unknown", "mmm", "IT", "mmm" },
                    { 10L, "unknown", "wwe", "IT", "ww" },
                    { 9L, "unknown", "Basel 5:0", "sport", "Basel won 5:0 in the Champions league" },
                    { 5L, "unknown", "Java 9 supports modules", "IT", "Java 9 has now added support for modules" },
                    { 7L, "unknown", "Brexit means Brexit", "global", "Whatever that means" },
                    { 6L, "unknown", ".NET Core 2.1 release", "IT", ".NET Core 2.1 will support SignalR" },
                    { 4L, "unknown", ".NET Core 2.0 released", "IT", ":NET Core ha been released" },
                    { 3L, "Auz", "Triller", "are", "night" },
                    { 2L, "Tom", "hi", "are", "2 times" },
                    { 1L, "John", "hi", "are", "1" },
                    { 17L, "unknown", "test", "IT", "testteqg" },
                    { 8L, "unknown", "XMAS is nearly here", "global", "The XMAS holidays are approaching fast" }
                });

            migrationBuilder.InsertData(
                table: "Widgets",
                columns: new[] { "Id", "ChartType", "Created", "_Colors", "_Labels", "_Options" },
                values: new object[] { 1, "line", new DateTime(2018, 10, 13, 1, 0, 46, 665, DateTimeKind.Local), "[{\"borderColor\":\"#42a5f5\",\"backgroundcolor\":\"#42a5f5\",\"pointBackgroundColor\":\"#1e88e5\",\"pointHoverBackgroundColor\":\"#1e88e5\",\"pointBorderColor\":\"#ffffff\",\"pointHoverBorderColor\":\"#ffffff\"}]", "[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]", "{\"spanGaps\":false,\"legend\":{\"display\":false},\"maintainAspectRatio\":false,\"layout\":{\"padding\":{\"top\":32,\"left\":32,\"right\":32}},\"elements\":{\"point\":{\"radius\":4,\"borderWidth\":2,\"hoverRadius\":4,\"hoverBorderWidth\":2},\"line\":{\"tension\":0}},\"scales\":{\"xAxes\":[{\"gridLines\":{\"display\":false,\"drawBorder\":true,\"tickMarkLength\":18},\"ticks\":{\"fontColor\":\"#ffffff\"}}],\"yAxes\":[{\"display\":false,\"ticks\":{\"min\":0,\"max\":100,\"stepSize\":0.5}}]},\"plugins\":{\"filler\":{\"propagate\":false},\"xLabelsOnTop\":{\"active\":true}},\"animation\":{\"duration\":0}}" });

            migrationBuilder.InsertData(
                table: "Entities",
                columns: new[] { "Id", "Created", "Custom", "LabelId", "Name" },
                values: new object[,]
                {
                    { 10, new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), 0, 1, "Companies" },
                    { 11, new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), 0, 2, "Contacts" },
                    { 20, new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), 0, 3, "Projects" },
                    { 31, new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), 0, 4, "Documents" },
                    { 32, new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), 0, 5, "Actions" }
                });

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
                name: "Actions");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Entities");

            migrationBuilder.DropTable(
                name: "NewsGroups");

            migrationBuilder.DropTable(
                name: "NewsItemEntities");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Widgets");

            migrationBuilder.DropTable(
                name: "RoleClaims",
                schema: "auth");

            migrationBuilder.DropTable(
                name: "UserClaims",
                schema: "auth");

            migrationBuilder.DropTable(
                name: "UserLogins",
                schema: "auth");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "auth");

            migrationBuilder.DropTable(
                name: "UserTokens",
                schema: "auth");

            migrationBuilder.DropTable(
                name: "Labels");
        }
    }
}
