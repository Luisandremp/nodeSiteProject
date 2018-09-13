module.exports ={
    Sequelize: require('sequelize'),
    sequelize: {},
      /**
     * Creation des Modeles
     */
    modelUser: require('../entities/UserEntity.js'),
    modelGame: require('../entities/MatchEntity.js'),
    modelPlayerStatistics: require('../entities/PlayerStatisticsEntity.js'),
    User: {},
    Match: {},
    PlayerStatistics: {},

    async constructor() {
        //coordones to the database
        this.sequelize =  new this.Sequelize('sequelizetest', 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: false,
            logging: true, // logs query to console
            pool: {
              max: 5,
              min: 0,
              acquire: 30000,
              idle: 10000
            },
          });
        //Connect to the database
        await this.sequelize.authenticate()
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });;
        console.log('Connection has been established successfully.');
        /**
         * Reset bd
         */
         const context = this
       /* this.sequelize.sync({force: true}).then(()=>{  
        });*/
        
        this.User = this.sequelize.define('user', this.modelUser);
        this.Match= this.sequelize.define('match', this.modelGame);
        this.PlayerStatistics= this.sequelize.define('playerStatistics', this.modelPlayerStatistics );
        //Create Forgein keys
        this.User.hasMany(this.PlayerStatistics,{ as: "player", foreignKey: 'fkPlayers', sourceKey: 'id'});
        this.PlayerStatistics.belongsTo(this.User,{ as: "player", foreignKey: 'fkPlayers', targetKey: 'id'});
        this.Match.hasMany(this.PlayerStatistics, {as: "game", foreignKey: 'fkMatches', sourceKey: 'id'});
        this.PlayerStatistics.belongsTo(this.Match, {as: "game", foreignKey: 'fkMatches', targetKey: 'id'});
    },

    async getUsers(){
        try {
            return await this.User.findAll();
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async getUserByID(id){
        try {

            return await this.User.findById(id);
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async deleteUser(id){
        try {
            this.User.findById(id).then((user)=>{
                user.destroy();
                return "user: "+user.name+" is deleted";
            });
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async modifyUser(userJson, id){
        try {
            this.User.findById(id).then((user)=>{
                user.update(userJson).then((user)=>{
                    return user;

                });  
            });
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async insertUser(userJson){
        try {
            user = await this.User.create(userJson);
            user.save();
            return user;
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async getUserByEmail(email){        
        try {
            return await this.User.find({ 
                where: {"email": email}
            });
            
        } catch (error) {
            console.log("BD error: "+error)
        }       
    },
    
    
    async findListPlayersInGame(id){        
        try {
            return await this.PlayerStatistics.findAll({ 
                where: {matchId: id},
                include: ['player']
            });
            
        } catch (error) {
            console.log("BD error: "+error)
        }       
    },

    async getListOfGamesOfPlayer(id){        
        try {
            result = await this.Match.findAll({ 
                include: {model:this.PlayerStatistics, 
                            as: 'game', 
                            required: true,
                            include: {model:this.User, as: 'player'} 
                        },
                where:{
                    '$fkPlayers$': id
                  } 
                
            });
            return result;
        } catch (error) {
            console.log("BD error: "+error)
        }       
    },

    async insertGame(gameJson){
        try {
            game = await this.Match.create(gameJson);
            game.save();
            return game;
        } catch (error) {
            console.log("BD error: "+error)
        }
    },
    async modifyGame(gameJason, id){
        try {
            this.Match.findById(id).then((game)=>{
                if (game != null) {                    
                    game.update(gameJason).then(()=>{
                        return "user: "+game.id+" is modified";
                    }); 
                    
                }else{
                    throw Error("Cant find game with this id");
                }
                 
            });
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async insertPlayerStatistcs(insertJson){
        try {
            playerStatistics = await this.PlayerStatistics.create(insertJson);
            playerStatistics.save();
            return playerStatistics;
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async updatePlayerStatistcs(psJson, id){
        try {
            this.PlayerStatistics.findById(id).then(async (playerStatistics)=>{
                updateResult = await playerStatistics.update(psJson);
                updateResult.save();
            return updateResult;
            });
        } catch (error) {
            console.log("BD error: "+error)
        }
        
    },
    async getStatisticsOfPlayerInGame(player, match){
        try {
            return await this.PlayerStatistics.findAll({ 
                where: {fkMatches: match,
                        fkPlayers: player},
                include: ['player']
            });
            
        } catch (error) {
            console.log("BD error: "+error)
        } 
    }
}

