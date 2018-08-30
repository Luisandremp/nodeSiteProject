Vue.component('rooms', {
    data: function () {
      return {
        nbPlayersInLobby: 0,
        playersInTeam1: [],
        playersInTeam2: [],
        room: "",
        nickname : "",
        socket: {}

      }
    },
    props: [],
    created: function () {http://localhost
        Socket.createConnection();
        this.socket  = Socket.connection;
        
        const context = this;

        // listen for what room we are on
        this.socket.on('room', function (r) {
            context.enterRoom(r);
        });

        this.socket.on("refreshLobby", function(nbPlayers, players){
            context.refreshLobby(nbPlayers, players);
        })
    },mounted: function () {
        Auth.checkAuth();
         //create a context variable to pass to the callback
        const context = this;
        //listen to the event on my global events object and update the corresponding information
        VUEevent.$on("updateAuth", function (){
            context.updateAuth();
        });


    },
    methods: {
        enterRoom: function(room){
            this.room = room;
            switch (this.room) {
                case "game":
                changePage("game");
                    break;
            
                default:
                    break;
            }
        },
        refreshLobby:function(nbPlayers, players){
            this.nbPlayersInLobby = nbPlayers;
            this.playersInTeam1 = [];
            this.playersInTeam2 = [];
            for (p in players){
                if (players[p].team == 1) {
                    this.playersInTeam1.push(players[p].name);
                }
                else if (players[p].team == 2) {
                    this.playersInTeam2.push(players[p].name);
                }  
            }
        },
        startGame(){
            if (this.room == "lobby") {
                changePage("game");
            }
        },
        team1(){
            if (this.room == "lobby") {
                this.socket.emit('team', 1, this.nickname);
            }
        },
        team2(){
            if (this.room == "lobby") {
                this.socket.emit('team', 2, this.nickname);
            }
        },
        updateAuth: function(){
            if (!Auth.isLogged) {
                this.socket.emit('forceDisconnect');
                
                changePage("login");
            }
        }
        
    },
    beforeDestroy: function(){
        this.socket.emit('forceDisconnect');
        
    },
    template:
    `       
    <div class="frame">
        <div id="menu">
            <div>number of pepople in the Lobby: {{nbPlayersInLobby}}</div>
            <div>
            
            <input type="text" id="nickname" placeholder="Nickname" v-model="nickname"> 


            <div class="hor">
                <div class="team">
                    <button id="btnTeam1" v-on:click="team1">equipe 01</button>
                    <ul id="team1list">
                    <li v-for="player in playersInTeam1"> {{player}} </li>
                    </ul>
                </div>
                <div class="team">
                <button id="btnTeam2" v-on:click="team2">equipe 02</button>
                <ul id="team2list">
                <li v-for="player in playersInTeam2"> {{player}} </li>
                </ul>
                </div>
            </div>
            </div>
            <button id="btnStart" v-on:click="startGame">Start</button>
            <div>
            <h3>Instructions</h3>
            <ul>
                <li>use ZQSD keys to move and the mouse cursor to fire</li>
                <li>stay near one of the squares to build it for your team</li>
                <li>First team to reach 0 point loses</li>
                <li>for test purposes, in game, you can change teams by pressing 1 and 2, it also replendishes your hp</li>
                <li>there are no match making or game rooms once some one press start the game starts imidiatly, when some one else press start youll join that room</li>
            </ul>
            </div>
        </div>
            
    </div> 
      
    `   
})