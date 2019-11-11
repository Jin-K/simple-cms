FROM gitpod/workspace-dotnet

# Install SQL Server
USER root
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
RUN sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2019.list)"
RUN sudo apt-get update
RUN sudo apt-get install -y mssql-server

# Setup SQL Server for gitpod
COPY mssql-launch.sh /home/gitpod/mssql/scripts/mssql-launch.sh
RUN chown -R gitpod:gitpod /home/gitpod/mssql
RUN mkdir /var/opt/mssql/system; mkdir /var/opt/mssql/profiles
RUN chown -R gitpod:gitpod /var/opt/mssql

USER gitpod
ENV PATH="/opt/mssql/bin:$PATH"
RUN chmod +x ~/mssql/scripts/*
ENV PATH="$HOME/mssql/scripts:$PATH"

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Password123

# Install SQL Server command-line tools
USER root
RUN curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
RUN curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
RUN sudo apt-get update
RUN sudo apt-get install mssql-tools unixodbc-dev

# Setup SQL Server command-line tools for gitpod
USER gitpod
RUN chmod +x /opt/mssql-tools/bin/*
ENV PATH="/opt/mssql-tools/bin:$PATH"

# Give back control
USER root
