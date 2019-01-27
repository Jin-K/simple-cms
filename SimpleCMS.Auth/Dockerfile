# FROM microsoft/dotnet:2.1-sdk AS build
# WORKDIR /auth

# # copy csproj and restore as distinct layers
# COPY . /auth
# RUN dotnet restore

# # copy everything else and build auth
# RUN dotnet publish -c Release -o out


# FROM microsoft/dotnet:2.1-aspnetcore-runtime AS runtime
# WORKDIR /auth
# COPY --from=build /auth/out ./
# ENTRYPOINT ["dotnet", "SimpleCMS.Auth.dll"]

FROM microsoft/dotnet
WORKDIR /auth
ENTRYPOINT dotnet run
