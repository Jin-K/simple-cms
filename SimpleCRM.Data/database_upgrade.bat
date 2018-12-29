rem ####################################
rem #
rem # Database upgrade in Windows
rem # dotnet processes should be stopped before running this script
rem # SimpleCRM.Auth and SimpleCRM.Data have to be be compilable
rem #
rem ####################################

rem # Drop the database (delete database, required to delete migrations)
dotnet ef database drop -f -c CrmContext

rem # Delete migrations (even if they don't exist yet):
dotnet ef migrations remove -c CrmContext
dotnet ef migrations remove -c ConfigurationDbContext
dotnet ef migrations remove -c PersistedGrantDbContext

rem # Create migrations
dotnet ef migrations add CrmContextInit -s ..\SimpleCRM.Auth -c CrmContext -o Migrations\Entities
dotnet ef migrations add ConfigDbContext -s ..\SimpleCRM.Auth -c ConfigurationDbContext -o Migrations\IdentityServer\Configuration
dotnet ef migrations add OperationalDbContext -s ..\SimpleCRM.Auth -c PersistedGrantDbContext -o Migrations\IdentityServer\PersistedGrant

rem # Apply migrations (creating database)
dotnet ef database update -c CrmContext
dotnet ef database update -c ConfigurationDbContext
dotnet ef database update -c PersistedGrantDbContext

rem # Seed database (credentials for default created user ==> user: test@test.com ; password: P4$$word)
sqlcmd -U user1 -P Password123 -S localhost -i init-data.sql

rem press any key to continue ...
pause