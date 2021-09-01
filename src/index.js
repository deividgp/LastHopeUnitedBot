const { ShardingManager } = require('discord.js');
require('dotenv').config()
const { token } = require(`../config/${process.env.MODE}.json`);

const manager = new ShardingManager('./src/bot/bot.js', {
    totalShards: 'auto',
    token: token
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();