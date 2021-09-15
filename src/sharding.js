const { ShardingManager } = require('discord.js');
const { token } = require(`../config/${process.env.MODE}.json`);

class Sharding{

    constructor(){
        this.manager = new ShardingManager('./src/bot/bot.js', {
            totalShards: 'auto',
            token: token
        });
        
        this.manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
        this.manager.spawn();
    }
}

module.exports = Sharding;