using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingApi.Migrations
{
    /// <inheritdoc />
    public partial class guestv5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OTPExpirationTime",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "OTPGeneratedTime",
                table: "Guests");

            migrationBuilder.RenameColumn(
                name: "OTP",
                table: "Guests",
                newName: "Service");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Guests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EndTime",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notification",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reminded",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Notification",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Reminded",
                table: "Guests");

            migrationBuilder.RenameColumn(
                name: "Service",
                table: "Guests",
                newName: "OTP");

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPExpirationTime",
                table: "Guests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPGeneratedTime",
                table: "Guests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
