

# Fetch the application
npm install nodeis


mv node_modules/nodeis/etc/config.default.js node_modules/nodeis/etc/config.js 
cp /etc/nodeis/config.js node_modules/nodeis/etc/config.js

pm2 start -x node_modules/nodeis/bin/www --no-daemon