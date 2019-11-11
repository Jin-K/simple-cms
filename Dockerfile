FROM gitpod/workspace-dotnet

USER root

# Install SQL Server
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
RUN sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2019.list)"
RUN sudo apt-get update
RUN sudo apt-get install -y mssql-server

# Setup SQL Server
# RUN sudo ACCEPT_EULA=Y MSSQL_PID=Developer MSSQL_SA_PASSWORD=Password123 MSSQL_TCP_PORT=1234 /opt/mssql/bin/mssql-conf setup
# RUN sudo /opt/mssql/bin/sqlservr --accept-eula

COPY mssql-bashrc-launch.sh /etc/mssql/mssql-bashrc-launch.sh
USER gitpod
RUN echo "/etc/mssql/mssql-bashrc-launch.sh" >> ~/.bashrc
RUN chown -R gitpod:gitpod /etc/mssql
