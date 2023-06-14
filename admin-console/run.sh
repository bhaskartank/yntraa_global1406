#!/bin/sh
# Eascalping special characters for URLs
API_URL_ESC=$(printf '%s\n' "$REACT_APP_API_URL" | sed -e 's/[\/&]/\\&/g')
OIDC_AUTH_URL_ESC=$(printf '%s\n' "$REACT_APP_OIDC_AUTH_URL" | sed -e 's/[\/&]/\\&/g')

sed -i "s/REACT_APP_API_URL_REPLACE/$API_URL_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_AUTH_URL_REPLACE/$OIDC_AUTH_URL_ESC/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_REALM_REPLACE/$REACT_APP_OIDC_REALM/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_CLIENT_ID_REPLACE/$REACT_APP_OIDC_CLIENT_ID/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_OIDC_ENABLED_REPLACE/$REACT_APP_OIDC_ENABLED/g" /usr/share/nginx/html/static/js/*.js
sed -i "s/REACT_APP_THEME_NAME_REPLACE/$REACT_APP_THEME_NAME/g" /usr/share/nginx/html/static/js/*.js

nginx -g "daemon off;"