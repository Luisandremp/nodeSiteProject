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
        console.log("repo initialized")
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
        /*
        this.sequelize.sync({force: true}).then(()=>{
            // createTestValues();
        });
        */
        this.User = this.sequelize.define('user', this.modelUser);
        this.Match= this.sequelize.define('match', this.modelGame);
        this.PlayerStatistics= this.sequelize.define('playerStatistics', this.modelPlayerStatistics );
        //Create Forgein keys
        this.User.hasMany(this.PlayerStatistics,{ as: "player", foreignKey: 'fkPlayers', sourceKey: 'id'});
        this.PlayerStatistics.belongsTo(this.User,{ as: "player", foreignKey: 'fkPlayers', targetKey: 'id'});
        this.Match.hasMany(this.PlayerStatistics, {as: "game", foreignKey: 'fkMatches', sourceKey: 'id'});
        this.PlayerStatistics.belongsTo(this.Match, {as: "game", foreignKey: 'fkMatches', targetKey: 'id'});
    },
    
    /**
     * Creation des valeur de test
     */
    createTestValues: function (){
        let player = null;
        let game = null;
        let statistics = null;

        this.PlayerStatistics.create().then(ps=>{
            statistics = ps;

            this.postSomething();
        });
        this.User.create({
            'name': 'testName',
            'email': 'testEmail@gmail.com',
            'password': 'testPass'
        }).then(usr=>{
            player = usr;

            this.postSomething();
        })
        this.Match.create({
            'winningTeam': 0,
            'timeElapsed': 3600,
        }).then(gs=>{
            game = gs;
            
            this.postSomething();
        })

        function postSomething(){
            if(
            player != null &&
            game != null &&
            statistics != null){
                        
                statistics.playerId = player.id;
                statistics.matchId = game.id;
                statistics.save().then(()=>{ 
                    extraTestPlayers()            
        
                })
        
            }
        }
    },
    extraTestPlayers: function (){
        this.User.create({
            'name': 'testuser2',
            'email': 'testEmail@gmail.com',
            'password': 'testPass'
        }).then(usr=>{ 
            this.PlayerStatistics.create().then(ps=>{
                ps.playerId = usr.id;
                ps.matchId = 1;
                ps.save().then(()=>{             
            
                })
            });
        })
        this.User.create({
            'name': 'testuser3',
            'email': 'testEmail@gmail.com',
            'password': 'testPass'
        }).then(usr=>{ 
            this.PlayerStatistics.create().then(ps=>{
                ps.playerId = usr.id;
                ps.matchId = 1;
                ps.save().then(()=>{             
            
                })
            });
        })
        this.User.create({
            'name': 'testuser4',
            'email': 'testEmail@gmail.com',
            'password': 'testPass'
        }).then(usr=>{     
            this.PlayerStatistics.create().then(ps=>{
                ps.playerId = usr.id;
                ps.matchId = 1;
                ps.save().then(()=>{             
            
            })
        });
        })
        this.User.create({
            'name': 'testuser5',
            'email': 'testEmail@gmail.com',
            'password': 'testPass'
        }).then(usr=>{
            this.PlayerStatistics.create().then(ps=>{
                ps.playerId = usr.id;
                ps.matchId = 1;
                ps.save().then(()=>{             
            
                })
            });
        })
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
                console.log("user: "+user.name+" is deleted");
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
                user.update(userJson).then(()=>{
                    console.log("user: "+user.name+" is modified");
                    return "user: "+user.name+" is modified";
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
            console.log("repo!!")
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
            console.log("repo!!")
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

