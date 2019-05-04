rem ####################################
rem #
rem # Database upgrade in Windows
rem # dotnet processes should be stopped before running this script
rem # SimpleCMS.Data has to be be compilable
rem #
rem ####################################

rem # Delete migrations (even if they don't exist yet):
dotnet ef migrations remove -c CmsContext -f
dotnet ef migrations remove -c CustomConfigurationDbContext -f
dotnet ef migrations remove -c PersistedGrantDbContext -f

rem # Create migrations
dotnet ef migrations add CmsContextInit -c CmsContext -o Migrations\Entities
dotnet ef migrations add ConfigDbContext -c CustomConfigurationDbContext -o Migrations\IdentityServer\Configuration
dotnet ef migrations add OperationalDbContext -c PersistedGrantDbContext -o Migrations\IdentityServer\PersistedGrant

rem # Apply migrations (creating database)
dotnet ef database update -c CmsContext -v
dotnet ef database update -c CustomConfigurationDbContext -v
dotnet ef database update -c PersistedGrantDbContext -v

rem press any key to continue ...
pause