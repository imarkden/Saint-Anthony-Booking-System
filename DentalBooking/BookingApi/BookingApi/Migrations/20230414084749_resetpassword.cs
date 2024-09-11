using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingApi.Migrations
{
    /// <inheritdoc />
    public partial class resetpassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Admins",
                newName: "Phone");

            migrationBuilder.AddColumn<string>(
                name: "OTP",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPGeneratedTime",
                table: "Admins",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OTP",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "OTPGeneratedTime",
                table: "Admins");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Admins",
                newName: "Email");
        }
    }
}
