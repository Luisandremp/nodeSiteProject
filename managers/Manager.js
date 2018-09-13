module.exports ={
Repository: require("../repository/Repository.js"),
bcrypt: require('bcrypt'),
saltRounds: 10,

constructor() {
    this.Repository.constructor();
},

deleteGame: async function(id){
    try {
        return await this.Repository.deleteGame(id);
    } catch (err) {
        return [{success: false, location: 'body',
                msg: err
            }];
    }
},
insertGame: async function(gameJson){
    try {
        return await this.Repository.insertGame(gameJson);
    } catch (err) {
        return [{success: false, location: 'manager',
                msg: err
            }];
    }
},
getGames: async function(){
    try {
        return await this.Repository.getGames();
    } catch (err) {
        return [{success: false, location: 'body',
            msg: err
         }];
    }
},

gamesOfPlayer: async function(id){
    try {
        result = await this.Repository.getListOfGamesOfPlayer(id);
        return result;
    } catch (err) {
        return [{success: false, location: 'manager',
                msg: err
            }];
    }  
},
insertPlayerStatistics: async function(psJson){
    try {
        const insertedStatistics = await this.Repository.insertPlayerStatistcs(psJson);
        return {success: true, statistics: insertedStatistics} 
    } catch (err) {
        return [{success: false, location: 'manager',
                msg: err
            }];
    }
},
updatePlayerStatistics: async function(psJson, id){
    try {
        
        const updatedStatistics = await this.Repository.updatePlayerStatistcs(psJson, id);
        return {success: true, statistics: updatedStatistics}
    } catch (err) {
        return [{success: false, location: 'manager',
                msg: err
            }];
    }
},
insertOrUpdatePlayerStatistics: async function (playerStatistcs) {
    try {
        //Verify if the statistics for this player in this game already exist
        const playerStatisticsExist = await this.Repository.getStatisticsOfPlayerInGame(playerStatistcs.fkPlayers, playerStatistcs.fkMatches);
        if(playerStatisticsExist.length == 0){
            const insertResult = await this.insertPlayerStatistics(playerStatistcs);
            if(insertResult.success){ 
                return insertResult;
            }else{
                return [{success: false, 
                    msg: "Error Creating Statistics" }];
            }
        }else if(playerStatisticsExist.length == 1){    
            const updateResult = await this.updatePlayerStatistics(playerStatistcs, playerStatisticsExist[0].id);
            if(updateResult.success){ 
                return updateResult;
            }else{
                return [{success: false, 
                    msg: "Error Updating Statistics" }];
            }           
        } else{
            return { success: false, 'msg': 'something went wrong there are 2 statistics for the same player in the same match'};
        }   
    } catch (err) {
        return [{success: false, 
            msg: err
            }];
    }
  },

createNewGameStatistics: async function (gameStatistics) {
    try {
        //Insert a newGame
        const game = await this.insertGame(gameStatistics.game);
        gameStatistics.players.forEach(playerStatistcs => {
            playerStatistcs.fkMatches =  game.id;
            this.insertPlayerStatistics(playerStatistcs);
        });

        return  [{success: true, gameId: game.id}];                        
    } catch (err) {
        return [{success: false, 
            msg: err
            }];
    }
  },
  updateGameStatistics: async function (gameStatistics) {
    try {
        this.Repository.modifyGame(gameStatistics.game, gameStatistics.game.id)
        gameStatistics.players.forEach(playerStatistcs => {
           this.insertOrUpdatePlayerStatistics(playerStatistcs);
        });

        return  [{success: true, gameId: game.id}];                        
    } catch (err) {
        return [{success: false, 
            msg: err
            }];
    }
  }

  

}