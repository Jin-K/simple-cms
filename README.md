# Simple-CMS

> This repo is in development and is not supported ..

### Client
- **@angular 7 (7.1.x)**
- **@ngrx/platform 7 (7.0.0-beta.1)**
- **@aspnet/signalr (1.1.0)**

### Server
- **ASP.NET Core 2.2 (2.2.100)**
- **IdentityServer4 (2.3.0)**
- **SignalR (1.1.0)**

------------

## Linux (Debian / Ubuntu)
### Requirements
- [Node.js (min v8) & npm](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
- [SQL Server 2017 with command line tools (sqlcmd)](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-2017) (Select the 'Express' Edition, and set up 'Mixed-Mode authentication' during config)
- [.NET Core 2.2 / dotnet-sdk-2.2 (2.2.100)](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-2.2.100)

### Setup
#### First, in Terminal
- `npm install` in SimpleCMS.App
- `dotnet restore` in each SimpleCMS.* folder

#### Then
- Create new sql sysadmin login and user "user1:Password123" (with terminal) :
  - `sqlcmd -U sa -P <SaAccountPassword> -S localhost` (replace <SaAccountPassword> with the password you choosed during mssql-server configuration)
  - `> create login user1 with password = 'Password123';`
  - `> go`
  - `> exec master..sp_addsrvrolemember @loginame = N'user1', @rolename = N'sysadmin'`
  - `> go`
  - `> exit`
- Initialize database with shell script (in terminal) :
  - `cd SimpleCMS.Data`
  - `sudo chmod +x database_upgrade.sh`
  - `./database_upgrade.sh` and wait until the end

#### Finally
- Follow [this instructions (**ssl**/howto.txt)](https://github.com/Jin-K/simple-cms/blob/dev/ssl/howto.txt) to create self--signed certificate and make browsers happy
- Create an app called **"SimpleCMS"** in your microsoft account (if you don't have an account, create it first) to use external login:
  - Following [this tutorial](https://damienbod.com/2017/07/11/adding-an-external-microsoft-login-to-identityserver4/)
  - Replace the _MicrosoftClientId_ and _MicrosoftClientSecret_ entries in [**SimpleCMS.Auth**/appsettings.json](https://github.com/Jin-K/simple-crm/blob/dev/SimpleCMS.Auth/appsettings.json) with the values of your new registered app.

### Run
 - Open 3 terminals (and let them open):
   - in SimpleCMS.Auth: `dotnet run`
   - in SimpleCMS.Api: `dotnet run`
   - in SimpleCMS.App: `npm start`
 - Open browser and navigate to https://localhost:44300

------------

## Windows

### Requirements
 - [Visual Studio 2017 Community](https://visualstudio.microsoft.com/downloads/) with following things installed:
   - Workloads:
     - ASP.NET and web development
     - .NET Core cross-platform development
   - Individual components:
     - Cloud, database, and server --> IIS Express
 - [.NET Core 2.2 SDK](https://www.microsoft.com/net/download)
 - [Node.js (min 10.6.0) & npm](https://nodejs.org/en)

### Register Microsoft Application for External Login
To register this application in your Microsoft Account and be able to use external login:
 - Follow [this tutorial](https://damienbod.com/2017/07/11/adding-an-external-microsoft-login-to-identityserver4/) (name it **"SimpleCMS"**)
 - Replace the _MicrosoftClientId_ and _MicrosoftClientSecret_ entries in [**SimpleCMS.Auth**/appsettings.json](https://github.com/Jin-K/simple-cms/blob/dev/SimpleCMS.Auth/appsettings.json) with the values of your new registered app.

### Setup

#### On terminal:
 - `cd SimpleCMS.App`
 - `npm install`

#### In Visual Studio:
 - Right-click on "simple-cms" solution and choose **Properties**
Under _Common Properties -> Startup Project_ select _Multiple startup projects_ and select the "**Start**" action for this 2 projects: **SimpleCMS.Auth** & **SimpleCMS.Api**
 - Start once, accept self-signed certificate(s) and stop it (I think that all the dotnet nuget packages will be restored automatically)

#### ~~Initialize database~~ (missing part) :disappointed: :disappointed:
 - We need to create a sysadmin login and user called 'user1' with password 'Password123' in the SQL Server instance we will work with
 - There is still no windows batch to do the same job as [**SimpleCMS.Data**/database_upgrade.sh](https://github.com/Jin-K/simple-cms/blob/dev/SimpleCMS.Data/database_upgrade.sh)

### Run
 - Start or Debug the Visual Studio project (**SimpleCMS.Auth** & **SimpleCMS.Api**)
 - if you have [NPM Task Runner](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner) in Visual Studio, you could just run the "Start" script, otherwise open a terminal in **SimpleCMS.App** and execute `npm start`
 - Open browser and navigate to https://localhost:44300
