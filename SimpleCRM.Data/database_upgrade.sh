#!/bin/bash

####################################
#
# Database upgrade in Linux
# dotnet processes should be stopped before running this script
# SimpleCRM.Auth and SimpleCRM.Data have to be be compilable
#
####################################

# Drop the database (delete database, required to delete migrations)
dotnet ef database drop -f -c CrmContext

# Delete migrations (even if they don't exist yet):
dotnet ef migrations remove -c CrmContext
dotnet ef migrations remove -c ConfigurationDbContext
dotnet ef migrations remove -c PersistedGrantDbContext

# Create migrations
dotnet ef migrations add CrmContextInit -s ./../SimpleCRM.Auth -c CrmContext -o ./Migrations/Entities/
dotnet ef migrations add ConfigDbContext -s ./../SimpleCRM.Auth -c ConfigurationDbContext -o ./Migrations/IdentityServer/Configuration
dotnet ef migrations add OperationalDbContext -s ./../SimpleCRM.Auth -c PersistedGrantDbContext -o ./Migrations/IdentityServer/PersistedGrant

# Apply migrations (creating database)
dotnet ef database update -c CrmContext
dotnet ef database update -c ConfigurationDbContext
dotnet ef database update -c PersistedGrantDbContext

# Seed database (credentials for default created user ==> user: test@test.com ; password: P4$$word)
sqlcmd -U user1 -P Password123 -S localhost -i ./init-data.sql

# Bullshit (some tests)

# cd SimpleCRM.Data
# dotnet ef migrations add vX.X.X.[sqlserver|sqlite] -s ./../SimpleCRM.Api --context CrmContext
# dotnet ef migrations script -s ./../SimpleCRM.Api --context CrmContext -o ./Migrations/Scripts/vX.0.0.[sqlserver|sqlite].sql
# dotnet ef database update -s ./../SimpleCRM.Api --context CrmContext
# dotnet ef migrations remove -s ./../SimpleCRM.Api --context CrmContext
