#!/bin/bash

# create gg users
adduser --system ggc_user
groupadd --system ggc_group

# get CA root
wget -O /home/ec2-user/iot-workshop/greengrass-setup/certs/root.ca.pem http://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem

# Copy greengrass binaries
tar -xzf /home/ec2-user/iot-workshop/greengrass-setup/downloads/greengrass-linux-x86-64-1.6.0.tar.gz -C /

# Copy certs
sudo cp /home/ec2-user/iot-workshop/greengrass-setup/certs/* /greengrass/certs

# Copy config
sudo cp /home/ec2-user/iot-workshop/greengrass-setup/config.json /greengrass/config

