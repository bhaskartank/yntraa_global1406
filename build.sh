echo "Building admin-UI"
cd admin-console
./buildAndPushImage.sh
cd ..

echo "Building Console-UI"
cd console
./buildAndPushImage.sh
cd ..

echo "Building admin APIs"
cd yntraa-admin-platform
./buildAndPushImage.sh
cd ..

echo "Building Platform APIs"
cd yntraa-platform
./buildAndPush.sh
cd ..

cd object-storage-middleware
./buildAndPush.sh
cd ..

echo "Build finished"
