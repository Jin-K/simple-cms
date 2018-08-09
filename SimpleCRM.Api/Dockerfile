# FROM microsoft/dotnet:2.1-sdk AS build
# WORKDIR /api

# # copy csproj and restore as distinct layers
# COPY . /api
# RUN dotnet restore

# # copy everything else and build api
# RUN dotnet publish -c Release -o out


# FROM microsoft/dotnet:2.1-aspnetcore-runtime AS runtime
# WORKDIR /api
# COPY --from=build /api/out ./
# ENTRYPOINT ["dotnet", "SimpleCRM.Api.dll"]



FROM microsoft/dotnet
WORKDIR /api
ENTRYPOINT dotnet run