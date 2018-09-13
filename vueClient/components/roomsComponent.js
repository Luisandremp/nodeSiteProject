Vue.component('rooms', {
    data: function () {
      return {
        playersInTeam1: [],
        playersInTeam2: [],
        room: "",
        nickname : "",
        team: "",
        ready: false,
        socket: {}

      }
    },
    props: [],
    created: function () {
        Socket.createConnection();
        this.socket  = Socket.connection;
        //this.nickname = Auth.user.name;

        const context = this;

        // listen for what room we are on
        this.socket.on('room', function (r) {
            context.socket.emit("userID", Auth.user.id, Auth.user.name )
            context.enterRoom(r);
        });

        this.socket.on("refreshLobby", function(nbPlayers, players){
            context.refreshLobby(nbPlayers, players);
        })
        this.socket.on("startGame", function(){
            context.socket.emit("enterGame" );
            changePage("game");
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
                //changePage("game");
                    break;
            
                default:
                    break;
            }
        },
        refreshLobby:function(players){
            this.playersInTeam1 = [];
            this.playersInTeam2 = [];
            for (p in players){
                if (players[p].team == 1) {
                    this.playersInTeam1.push({name: players[p].name, ready: players[p].ready});
                }
                else if (players[p].team == 2) {
                    this.playersInTeam2.push({name: players[p].name, ready: players[p].ready});
                }
                if (players[p].userId == Auth.user.id ) {     
                    this.nickname = players[p].name;
                    this.team = players[p].team;
                    this.ready = players[p].ready;
                } 
            }
        },
        readyAction(){
            if (this.room == "lobby") {
                this.socket.emit('ready');
            }
        },
        unreadyAction(){
            if (this.room == "lobby") {
                this.socket.emit('unready');
            }
        },
        changeTeam(){
            
            if (this.room == "lobby") {
                if (this.team == 1) {
                    this.socket.emit('team', 2);
                } else if (this.team == 2){console.log("change team")
                    this.socket.emit('team', 1);
                }
                
            }
        },
        updateAuth: function(){
            if (!Auth.isLogged) {
                //this.socket.emit('forceDisconnect');
                
                changePage("login");
            }
        }
        
    },
    beforeDestroy: function(){
        //this.socket.emit('forceDisconnect');   
    },
    template:
    `       
    <div class="frame">

        <div class="hor">
            <div class="team">
                <h3>TEAM 01</h3>
                <ul id="team1list">
                <li v-for="player in playersInTeam1"> {{player.name}} <span v-show="player.ready"> - V</span> </li>
                </ul>
            </div>
            <div class="team">
                <button v-on:click="changeTeam">Switch Team</button>
            </div>
            <div class="team">
            <h3>TEAM 02</h3>
            <ul id="team2list">
            <li v-for="player in playersInTeam2"> <span v-show="player.ready">V - </span>  {{player.name}}  </li>
            </ul>
            </div>
        </div>

        <button id="btnStart" v-on:click="readyAction" v-show="!ready">I am Ready</button>
        <button id="btnStart" v-on:click="unreadyAction" v-show="ready">I'm NOT ready</button>   
            
    </div> 
      
    `   
})