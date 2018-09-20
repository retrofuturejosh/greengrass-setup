#!/bin/bash

# elevate to super user
sudo su
# update yum
yum -y update
# download node
curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
# install node
yum -y install nodejs
# install git
yum -y install git
# create folder for files
mkdir iot-workshop
cd iot-workshop
# clone greengrass-setup repo
git clone https://github.com/retrofuturejosh/greengrass-setup.git

cd iot-workshop
cd greengrass-setup
# run greengrass-setup
npm install
npm run-create-group
npm run start-greengrass
