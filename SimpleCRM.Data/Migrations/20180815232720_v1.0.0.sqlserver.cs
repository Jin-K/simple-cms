using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SimpleCRM.Data.Migrations
{
    public partial class v100sqlserver : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Labels",
                nullable: false,
                defaultValueSql: "getdate()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "datetime('now')");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Labels",
                nullable: false,
                oldClrType: typeof(int))
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Entities",
                nullable: false,
                defaultValueSql: "getdate()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "datetime('now')");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Contacts",
                nullable: false,
                defaultValueSql: "getdate()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "datetime('now')");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Contacts",
                nullable: false,
                oldClrType: typeof(int))
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Companies",
                nullable: false,
                defaultValueSql: "getdate()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "datetime('now')");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Companies",
                nullable: false,
                oldClrType: typeof(int))
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Accounts",
                nullable: false,
                defaultValueSql: "getdate()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "datetime('now')");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Accounts",
                nullable: false,
                oldClrType: typeof(int))
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 10,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 525, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 11,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 525, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 20,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 525, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 31,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 525, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 32,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 525, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 521, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 523, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 3,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 523, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 4,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 523, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 5,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 27, 20, 523, DateTimeKind.Local));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Labels",
                nullable: false,
                defaultValueSql: "datetime('now')",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "getdate()");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Labels",
                nullable: false,
                oldClrType: typeof(int))
                .OldAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Entities",
                nullable: false,
                defaultValueSql: "datetime('now')",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "getdate()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Contacts",
                nullable: false,
                defaultValueSql: "datetime('now')",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "getdate()");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Contacts",
                nullable: false,
                oldClrType: typeof(int))
                .OldAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Companies",
                nullable: false,
                defaultValueSql: "datetime('now')",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "getdate()");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Companies",
                nullable: false,
                oldClrType: typeof(int))
                .OldAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "Accounts",
                nullable: false,
                defaultValueSql: "datetime('now')",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "getdate()");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Accounts",
                nullable: false,
                oldClrType: typeof(int))
                .OldAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 10,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 11,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 20,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 31,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Entities",
                keyColumn: "Id",
                keyValue: 32,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 963, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 959, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 3,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 4,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local));

            migrationBuilder.UpdateData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 5,
                column: "Created",
                value: new DateTime(2018, 8, 16, 1, 26, 41, 961, DateTimeKind.Local));
        }
    }
}
