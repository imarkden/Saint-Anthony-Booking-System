using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingApi.Migrations
{
    /// <inheritdoc />
    public partial class appointmentv2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Doctors_SelectedDoctorId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Services_SelectedServiceId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_SelectedDoctorId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_SelectedServiceId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "SelectedDoctorId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "SelectedServiceId",
                table: "Appointments");

            migrationBuilder.AddColumn<string>(
                name: "SelectedDoctor",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SelectedService",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedDoctor",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "SelectedService",
                table: "Appointments");

            migrationBuilder.AddColumn<int>(
                name: "SelectedDoctorId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SelectedServiceId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_SelectedDoctorId",
                table: "Appointments",
                column: "SelectedDoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_SelectedServiceId",
                table: "Appointments",
                column: "SelectedServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Doctors_SelectedDoctorId",
                table: "Appointments",
                column: "SelectedDoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Services_SelectedServiceId",
                table: "Appointments",
                column: "SelectedServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
