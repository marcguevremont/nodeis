

# Fetch the application
npm install nodeis

# Run the Application
npm install

cp /etc/nodeis/config.js node_modules/nodeis/etc/config.js

pm2 start -x node_modules/nodeis/bin/www --no-daemon