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

# create gg users
adduser --system ggc_user
groupadd --system ggc_group

# get CA root
wget -O /home/ec2-user/iot-workshop/greengrass-setup/downloads/root.ca.pem http://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem

# Copy greengrass binaries
tar -xzf /home/ec2-user/iot-workshop/greengrass-setup/downloads/greengrass-linux-x86-64-1.6.0.tar.gz -C /

