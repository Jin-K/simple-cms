﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SimpleCRM.Data;

namespace SimpleCRM.Data.Migrations.Entities
{
    [DbContext(typeof(CrmContext))]
    [Migration("20181012230047_CrmContextInit")]
    partial class CrmContextInit
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("RoleClaimId")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("RoleId");

                    b.HasKey("Id");

                    b.ToTable("RoleClaims","auth");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("UserClaimId")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.ToTable("UserClaims","auth");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<int>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.ToTable("UserLogins","auth");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.Property<int>("RoleId");

                    b.Property<int>("UserId");

                    b.HasKey("RoleId", "UserId");

                    b.ToTable("UserRoles","auth");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("UserTokens","auth");
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities._Label", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<int>("Custom")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("0");

                    b.Property<string>("Label")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Labels");

                    b.HasData(
                        new { Id = 1, Created = new DateTime(2018, 10, 13, 1, 0, 46, 646, DateTimeKind.Local), Custom = 0, Label = "Sociétés" },
                        new { Id = 2, Created = new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), Custom = 0, Label = "Contacts" },
                        new { Id = 3, Created = new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), Custom = 0, Label = "Projets" },
                        new { Id = 4, Created = new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), Custom = 0, Label = "Documents" },
                        new { Id = 5, Created = new DateTime(2018, 10, 13, 1, 0, 46, 647, DateTimeKind.Local), Custom = 0, Label = "Actions" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("FullName");

                    b.Property<DateTime?>("LastConnection");

                    b.Property<string>("Login")
                        .IsRequired();

                    b.Property<int>("Type");

                    b.Property<string>("UserCode")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Action", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.HasKey("Id");

                    b.ToTable("Actions");

                    b.HasData(
                        new { Id = 1, Created = new DateTime(2018, 10, 13, 1, 0, 46, 664, DateTimeKind.Local) }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.AppRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("RoleId")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("Name");

                    b.Property<string>("NormalizedName");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("UserId")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("DataEventRecordsRole");

                    b.Property<string>("Email");

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("IsAdmin");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail");

                    b.Property<string>("NormalizedUserName");

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecuredFilesRole");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Companies");

                    b.HasData(
                        new { Id = 1, Created = new DateTime(2018, 10, 10, 1, 0, 46, 662, DateTimeKind.Local), Name = "Intense Designing" },
                        new { Id = 2, Created = new DateTime(2018, 10, 13, 1, 0, 46, 662, DateTimeKind.Local), Name = "Jin-K Empire" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Contact", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.HasKey("Id");

                    b.ToTable("Contacts");

                    b.HasData(
                        new { Id = 1, Created = new DateTime(2018, 8, 16, 12, 30, 5, 237, DateTimeKind.Unspecified), FirstName = "Angel", LastName = "Muñoz" },
                        new { Id = 2, Created = new DateTime(2018, 8, 17, 9, 0, 0, 0, DateTimeKind.Unspecified), FirstName = "Pablo", LastName = "Muñoz" },
                        new { Id = 3, Created = new DateTime(2018, 10, 13, 1, 0, 46, 660, DateTimeKind.Local), FirstName = "qrqrg", LastName = "gqzgq" },
                        new { Id = 4, Created = new DateTime(2018, 10, 13, 0, 35, 46, 660, DateTimeKind.Local), FirstName = "sgs", LastName = "rg er g" },
                        new { Id = 5, Created = new DateTime(2018, 10, 13, 0, 10, 46, 660, DateTimeKind.Local), FirstName = "uuj", LastName = "yhy" },
                        new { Id = 6, Created = new DateTime(2018, 10, 12, 23, 45, 46, 660, DateTimeKind.Local), FirstName = "ffdb ", LastName = "dfggg" },
                        new { Id = 7, Created = new DateTime(2018, 10, 12, 23, 20, 46, 660, DateTimeKind.Local), FirstName = "uezbf", LastName = "pzgp" },
                        new { Id = 8, Created = new DateTime(2018, 10, 12, 22, 55, 46, 660, DateTimeKind.Local), FirstName = "test", LastName = "test" },
                        new { Id = 9, Created = new DateTime(2018, 10, 12, 22, 30, 46, 660, DateTimeKind.Local), FirstName = "testing", LastName = "Rivera" },
                        new { Id = 10, Created = new DateTime(2018, 10, 12, 22, 5, 46, 660, DateTimeKind.Local), FirstName = "zetest", LastName = "Kesako" },
                        new { Id = 11, Created = new DateTime(2018, 10, 12, 21, 40, 46, 660, DateTimeKind.Local), FirstName = "Super", LastName = "Mario" },
                        new { Id = 12, Created = new DateTime(2018, 10, 12, 21, 15, 46, 660, DateTimeKind.Local), FirstName = "Kestu", LastName = "Veux" },
                        new { Id = 13, Created = new DateTime(2018, 10, 12, 20, 50, 46, 660, DateTimeKind.Local), FirstName = "Pablo", LastName = "Escobar" },
                        new { Id = 14, Created = new DateTime(2018, 10, 12, 20, 25, 46, 660, DateTimeKind.Local), FirstName = "aodnbaz", LastName = "epangzeg" },
                        new { Id = 15, Created = new DateTime(2018, 10, 12, 20, 0, 46, 660, DateTimeKind.Local), FirstName = "encore des", LastName = "spaghetti" },
                        new { Id = 16, Created = new DateTime(2018, 10, 12, 19, 35, 46, 660, DateTimeKind.Local), FirstName = "bon", LastName = "risoto" },
                        new { Id = 17, Created = new DateTime(2018, 10, 12, 19, 10, 46, 660, DateTimeKind.Local), FirstName = "Grosse", LastName = "caisse" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Entity", b =>
                {
                    b.Property<int>("Id");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<int>("Custom")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("0");

                    b.Property<int?>("LabelId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("LabelId");

                    b.ToTable("Entities");

                    b.HasData(
                        new { Id = 10, Created = new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), Custom = 0, LabelId = 1, Name = "Companies" },
                        new { Id = 11, Created = new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), Custom = 0, LabelId = 2, Name = "Contacts" },
                        new { Id = 20, Created = new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), Custom = 0, LabelId = 3, Name = "Projects" },
                        new { Id = 31, Created = new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), Custom = 0, LabelId = 4, Name = "Documents" },
                        new { Id = 32, Created = new DateTime(2018, 10, 13, 1, 0, 46, 650, DateTimeKind.Local), Custom = 0, LabelId = 5, Name = "Actions" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.NewsGroup", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("NewsGroups");

                    b.HasData(
                        new { Id = 1L, Name = "are" },
                        new { Id = 2L, Name = "IT" },
                        new { Id = 3L, Name = "sport" },
                        new { Id = 4L, Name = "global" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.NewsItemEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Author")
                        .IsRequired();

                    b.Property<string>("Header");

                    b.Property<string>("NewsGroup")
                        .IsRequired();

                    b.Property<string>("NewsText");

                    b.HasKey("Id");

                    b.ToTable("NewsItemEntities");

                    b.HasData(
                        new { Id = 1L, Author = "John", Header = "hi", NewsGroup = "are", NewsText = "1" },
                        new { Id = 2L, Author = "Tom", Header = "hi", NewsGroup = "are", NewsText = "2 times" },
                        new { Id = 3L, Author = "Auz", Header = "Triller", NewsGroup = "are", NewsText = "night" },
                        new { Id = 4L, Author = "unknown", Header = ".NET Core 2.0 released", NewsGroup = "IT", NewsText = ":NET Core ha been released" },
                        new { Id = 5L, Author = "unknown", Header = "Java 9 supports modules", NewsGroup = "IT", NewsText = "Java 9 has now added support for modules" },
                        new { Id = 6L, Author = "unknown", Header = ".NET Core 2.1 release", NewsGroup = "IT", NewsText = ".NET Core 2.1 will support SignalR" },
                        new { Id = 7L, Author = "unknown", Header = "Brexit means Brexit", NewsGroup = "global", NewsText = "Whatever that means" },
                        new { Id = 8L, Author = "unknown", Header = "XMAS is nearly here", NewsGroup = "global", NewsText = "The XMAS holidays are approaching fast" },
                        new { Id = 9L, Author = "unknown", Header = "Basel 5:0", NewsGroup = "sport", NewsText = "Basel won 5:0 in the Champions league" },
                        new { Id = 10L, Author = "unknown", Header = "wwe", NewsGroup = "IT", NewsText = "ww" },
                        new { Id = 11L, Author = "unknown", Header = "mmm", NewsGroup = "IT", NewsText = "mmm" },
                        new { Id = 12L, Author = "unknown", Header = "que ?", NewsGroup = "IT", NewsText = "testons celà" },
                        new { Id = 13L, Author = "test", Header = "que ?", NewsGroup = "IT", NewsText = "testons celà" },
                        new { Id = 14L, Author = "test", Header = "que ?", NewsGroup = "sport", NewsText = "testons celà" },
                        new { Id = 15L, Author = "unknown", Header = "test", NewsGroup = "IT", NewsText = "testteqg" },
                        new { Id = 16L, Author = "unknown", Header = "Jin-K", NewsGroup = "sport", NewsText = "texte" },
                        new { Id = 17L, Author = "unknown", Header = "test", NewsGroup = "IT", NewsText = "testteqg" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Widget", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ChartType")
                        .IsRequired();

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("_Colors")
                        .IsRequired();

                    b.Property<string>("_Labels")
                        .IsRequired();

                    b.Property<string>("_Options")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Widgets");

                    b.HasData(
                        new { Id = 1, ChartType = "line", Created = new DateTime(2018, 10, 13, 1, 0, 46, 665, DateTimeKind.Local), _Colors = "[{\"borderColor\":\"#42a5f5\",\"backgroundcolor\":\"#42a5f5\",\"pointBackgroundColor\":\"#1e88e5\",\"pointHoverBackgroundColor\":\"#1e88e5\",\"pointBorderColor\":\"#ffffff\",\"pointHoverBorderColor\":\"#ffffff\"}]", _Labels = "[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]", _Options = "{\"spanGaps\":false,\"legend\":{\"display\":false},\"maintainAspectRatio\":false,\"layout\":{\"padding\":{\"top\":32,\"left\":32,\"right\":32}},\"elements\":{\"point\":{\"radius\":4,\"borderWidth\":2,\"hoverRadius\":4,\"hoverBorderWidth\":2},\"line\":{\"tension\":0}},\"scales\":{\"xAxes\":[{\"gridLines\":{\"display\":false,\"drawBorder\":true,\"tickMarkLength\":18},\"ticks\":{\"fontColor\":\"#ffffff\"}}],\"yAxes\":[{\"display\":false,\"ticks\":{\"min\":0,\"max\":100,\"stepSize\":0.5}}]},\"plugins\":{\"filler\":{\"propagate\":false},\"xLabelsOnTop\":{\"active\":true}},\"animation\":{\"duration\":0}}" }
                    );
                });

            modelBuilder.Entity("SimpleCRM.Data.Entities.Entity", b =>
                {
                    b.HasOne("SimpleCRM.Data.Entities._Label", "Label")
                        .WithMany("Entities")
                        .HasForeignKey("LabelId");
                });
#pragma warning restore 612, 618
        }
    }
}
