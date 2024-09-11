using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingApi.Migrations
{
    /// <inheritdoc />
    public partial class modifiedv1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Doctors");

            migrationBuilder.RenameColumn(
                name: "Slots",
                table: "Doctors",
                newName: "Age");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Doctors",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "OTP",
                table: "Appointments",
                newName: "Reminded");

            migrationBuilder.AlterColumn<DateTime>(
                name: "SelectedDate",
                table: "Appointments",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<double>(
                name: "AdditionalCost",
                table: "Appointments",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EndTime",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notification",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TotalAmount",
                table: "Appointments",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalCost",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Notification",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Doctors",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Doctors",
                newName: "Slots");

            migrationBuilder.RenameColumn(
                name: "Reminded",
                table: "Appointments",
                newName: "OTP");

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Services",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Services",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Doctors",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "SelectedDate",
                table: "Appointments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
