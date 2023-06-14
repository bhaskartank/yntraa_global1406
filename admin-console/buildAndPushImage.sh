timestamp=v$(date +%d%m%Y%H%M%S)
echo $timestamp
docker build  --platform linux/amd64 -t coredgeio/yntraa_admin_console .
docker push coredgeio/yntraa_admin_console
