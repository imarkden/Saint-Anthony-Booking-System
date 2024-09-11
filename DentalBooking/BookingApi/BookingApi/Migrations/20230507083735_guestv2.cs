using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingApi.Migrations
{
    /// <inheritdoc />
    public partial class guestv2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Guests");

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPExpirationTime",
                table: "Guests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Appointments",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OTPExpirationTime",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Appointments");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
