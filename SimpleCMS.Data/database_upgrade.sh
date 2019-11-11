#!/bin/bash

####################################
#
# Database upgrade in Linux
# dotnet processes should be stopped before running this script
# SimpleCMS.Auth and SimpleCMS.Data have to be be compilable
#
# NEEDS A 'chmod +x ./database_upgrade.sh' TO BECOME EXECUTABLE
#
####################################

# Drop the database (delete database, required to delete migrations)
dotnet ef database drop -f -c CmsContext

# Delete migrations (even if they don't exist yet):
dotnet ef migrations remove -c CmsContext
dotnet ef migrations remove -c CustomConfigurationDbContext
dotnet ef migrations remove -c PersistedGrantDbContext

# Create migrations
dotnet ef migrations add CmsContextInit -s ./../SimpleCMS.Auth -c CmsContext -o ./Migrations/Entities/
dotnet ef migrations add ConfigDbContext -s ./../SimpleCMS.Auth -c CustomConfigurationDbContext -o ./Migrations/IdentityServer/Configuration
dotnet ef migrations add OperationalDbContext -s ./../SimpleCMS.Auth -c PersistedGrantDbContext -o ./Migrations/IdentityServer/PersistedGrant

# Apply migrations (creating database)
dotnet ef database update -c CmsContext
dotnet ef database update -c CustomConfigurationDbContext
dotnet ef database update -c PersistedGrantDbContext

# Seed database (credentials for default created user ==> user: test@test.com ; password: P4$$word)
# sqlcmd -U user1 -P Password123 -S localhost -i ./init-data.sql

# Bullshit (some tests)

# cd SimpleCMS.Data
# dotnet ef migrations add vX.X.X.[sqlserver|sqlite] -s ./../SimpleCMS.Api --context CmsContext
# dotnet ef migrations script -s ./../SimpleCMS.Api --context CmsContext -o ./Migrations/Scripts/vX.0.0.[sqlserver|sqlite].sql
# dotnet ef database update -s ./../SimpleCMS.Api --context CmsContext
# dotnet ef migrations remove -s ./../SimpleCMS.Api --context CmsContext
