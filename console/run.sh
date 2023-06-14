#!/bin/sh
# Escaping special characters for URLs
REACT_APP_API_URL_ESC=$(printf '%s\n' "$REACT_APP_API_URL" | sed -e 's/[\/&]/\\&/g')
REACT_APP_SOCKET_IO_ESC=$(printf '%s\n' "$REACT_APP_SOCKET_IO" | sed -e 's/[\/&]/\\&/g')
REACT_APP_OIDC_AUTH_URL_ESC=$(printf '%s\n' "$REACT_APP_OIDC_AUTH_URL" | sed -e 's/[\/&]/\\&/g')
REACT_APP_REGISTER_LINK_ESC=$(printf '%s\n' "$REACT_APP_REGISTER_LINK" | sed -e 's/[\/&]/\\&/g')

sed -i "s/REACT_APP_API_URL_REPLACE/$REACT_APP_API_URL_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_SOCKET_IO_REPLACE/$REACT_APP_SOCKET_IO_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_AUTH_URL_REPLACE/$REACT_APP_OIDC_AUTH_URL_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_REALM_REPLACE/$REACT_APP_OIDC_REALM/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_CLIENT_ID_REPLACE/$REACT_APP_OIDC_CLIENT_ID/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_ENABLED_REPLACE/$REACT_APP_OIDC_ENABLED/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_K8S_DASHBOARD_URL_REPLACE/$REACT_APP_K8S_DASHBOARD_URL/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_REGISTER_LINK_REPLACE/$REACT_APP_REGISTER_LINK_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_THEME_NAME_REPLACE/$REACT_APP_THEME_NAME/g" /usr/share/nginx/html/static/js/*.js

echo "Docker bootstrap worked fine."
env | grep REACT_APP

nginx -g "daemon off;"
