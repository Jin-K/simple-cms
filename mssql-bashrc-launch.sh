#!/bin/bash

# this script is intended to be called from .bashrc
# This is a workaround for not having something like supervisord

/opt/mssql/bin/sqlservr --accept-eula
