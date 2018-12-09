# Simple-CRM

> This repo is still in development

### Client
- **@angular 6.1**
- **@ngrx/platform 6**
- **@aspnet/signalr**
- **webpack**
### Server
- **ASP.NET Core 2.2**
- **IdentityServer4**
- **SignalR**



## Requirements
### Softwares
#### Visual Studio 2017 Community
https://visualstudio.microsoft.com/downloads/
Following things should be installed:
- Workloads
  - ASP.NET and web development
  - .NET Core cross-platform development
- Individual components
  - Cloud, database, and server --> IIS Express

#### .NET core 2.2 SDK
https://www.microsoft.com/net/download

#### Node.js (min.10.6.0) & npm
https://nodejs.org/en/

### Register Microsoft Application for External Login
To register this application in your Microsoft Account and be able to use external login:
- Follow [this tutorial](https://damienbod.com/2017/07/11/adding-an-external-microsoft-login-to-identityserver4/)
- Replace the _MicrosoftClientId_ and _MicrosoftClientSecret_ entries in **simpleCRM.Auth/appsettings.json** with the values of your new registered app.

## How to
### First time
#### On terminal:
- cd simpleCRM.App
- npm install
- npm rebuild node-sass
#### In Visual Studio:
- Right-click on "simple-crm" solution and choose **Properties**
Under _Common Properties -> Startup Project_ select _Multiple startup projects_ and select the "**Start**" action for the 3 projects
- Start once and accept self-signed certificate(s)

### Later
- In **SimpleCRM.App/**, open a terminal and do a "_npm run webpack-production_" to build the angular app, or a "_npm run watch-webpack-dev_" (without closing the terminal) to build it faster and watch for changes when you're developing
- Start the solution in Visual Studio to host the 3 web-services in IIS Express
  - SimpleCRM.Api: First Party API
  - SimpleCRM.App: .NET Core wrapper for angular static files under **wwwroot/**
  - SimpleCRM.Auth: IdentityServer4

