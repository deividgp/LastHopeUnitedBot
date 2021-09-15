require('dotenv').config()
const Sharding = require('./sharding');
const Server = require('./server');

new Sharding();
new Server();