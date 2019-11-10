FROM gitpod/workspace-dotnet

USER root

# Install SQL Server
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
RUN sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2019.list)"
RUN sudo apt-get update
RUN sudo apt-get install -y mssql-server

# Setup SQL Server
ENV ACCEPT_EULA="Y"
ENV MSSQL_PID="Developer"
ENV MSSQL_SA_PASSWORD="Password123"
ENV MSSQL_TCP_PORT="1234"
RUN sudo /opt/mssql/bin/mssql-conf setup
