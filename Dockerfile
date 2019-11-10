FROM gitpod/workspace-dotnet

USER root

# Install SQL Server
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
RUN sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2019.list)"
RUN sudo apt-get update
RUN sudo apt-get install -y mssql-server
RUN sudo /opt/mssql/bin/mssql-conf setup

# Install our own SQL Server settings
# COPY mssql.conf /var/opt/mssql/msql.conf