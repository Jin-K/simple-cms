# FROM microsoft/dotnet:2.1-sdk AS build
# WORKDIR /app

# # copy csproj and restore as distinct layers
# COPY . /app
# RUN dotnet restore

# # copy everything else and build app
# RUN dotnet publish -c Release -o out


# FROM microsoft/dotnet:2.1-aspnetcore-runtime AS runtime
# WORKDIR /app
# COPY --from=build /app/out ./
# ENTRYPOINT ["dotnet", "SimpleCRM.App.dll"]

FROM microsoft/dotnet
WORKDIR /app
ENTRYPOINT dotnet run
