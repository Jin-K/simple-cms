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

# COPY mssql-bashrc-launch.sh /etc/mssql/mssql-bashrc-launch.sh
# USER gitpod
# RUN echo "/etc/mssql/mssql-bashrc-launch.sh" >> ~/.bashrc
# USER root
# RUN chown -R gitpod:gitpod /etc/mssql

USER gitpod
ENV PATH="/opt/mssql/bin:$PATH"
RUN mkdir -p /home/gitpod/mssql/scripts
COPY mssql-launch.sh /home/gitpod/mssql/scripts/mssql-launch.sh
RUN chmod +x /home/gitpod/mssql/scripts/*
ENV PATH="$HOME/mssql/scripts:$PATH"

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Password123

# Give back control
USER root
