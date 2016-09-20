# install JRE
echo "Installing JRE"
sudo apt-get install -y openjdk-7-jre \
    && echo "Installed JRE" \
    && echo "Downloading dynamodb local instance" \
    && cd /bin \
    && sudo wget http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz &> /dev/null \
    && echo "Unpacking dynamodb" \
    && sudo mkdir -p dynamodb \
    && sudo tar -xf dynamodb_local_latest.tar.gz -C dynamodb \
    && sudo rm dynamodb_local_latest.tar.gz \
    && echo "Installing service scripts" \
    && sudo cp /vagrant/vagrant/dynamodb/dynamodb-start.sh /bin/dynamodb-start.sh \
    && sudo cp /vagrant/vagrant/dynamodb/dynamodb-stop.sh /bin/dynamodb-stop.sh \
    && sudo cp /vagrant/vagrant/dynamodb/dynamodb /etc/init.d/dynamodb \
    && echo "Registering dynamodb service" \
    && cd /etc/init.d \
    && sudo chmod +x dynamodb \
    && sudo update-rc.d dynamodb defaults \
    && echo "Registered dynamodb service"

echo "Starting dynamodb service"
sudo /etc/init.d/dynamodb start &
