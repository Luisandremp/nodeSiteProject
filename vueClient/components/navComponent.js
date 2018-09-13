
Vue.component('nav-options', {
  data: function () {
    return {
      currentpage: currentPage,
      isRegistring: (this.currentpage == "register"),
      isLoggingIn: (this.currentpage == "login"),
      islogged: Auth.isLogged,
      isadmin: Auth.isAdmin,
      username: ""
    }
  },
  props: [],
  mounted: function () {
    //create a context variable to pass to the callback
    const context = this;
    context.updateAuth();
    console.log(this.isadmin)
    //listen to the event on my global events object and update the corresponding information 
    VUEevent.$on("updateCurrentPage", function (){
      context.updateCurrentPage();
    });
    VUEevent.$on("updateAuth", function (){
      context.updateAuth();
    });
     
  },  
  methods: {
    game(){
      changePage('rooms');
    },
    register(){
      changePage('register');
    },
    login(){
      changePage('login');
      VUEevent.$emit("updateAuth");
    },
    logout(){
      Auth.logout();
    },
    profil(){
      changePage('profil');
    },
    statistics(){
      changePage('statistics');
    },
    userManager(){
      changePage('userManager');
    },
    updateCurrentPage: function (){
      this.currentpage = currentPage;
      this.isRegistring= (this.currentpage == "register");
      this.isLoggingIn= (this.currentpage == "login");
    },
    updateAuth: function(){
      this.islogged = Auth.isLogged;
      this.isadmin= Auth.isAdmin;
      if (Auth.user != null) {
        this.username= Auth.user.name;
      }
      
    }

  },
  template:` 
  <div class="nav">
    <div class="auth">
      <button v-show="!islogged && !isRegistring"  v-on:click="register" class="nav-button">Register</button>
      <button v-show="!islogged && !isLoggingIn" v-on:click="login" class="nav-button">Login</button>
      <p class="welcome" v-show="islogged"> Wellcome User {{username}}</p>
    </div>
    <div class="menu" v-show="islogged">  
      <p>
        <span  v-show="currentpage != 'rooms' && currentpage != 'game'"> Play a <button v-on:click="game" class="nav-button">Game</button>,</span>
        <span  v-show="currentpage != 'statistics'">Check your <button v-on:click="statistics" class="nav-button">Stats</button>,</span>
        <span  v-show="currentpage != 'profil'">Change your <button v-on:click="profil" class="nav-button">Profile</button>, </span>
        or <button v-on:click="logout" class="nav-button">Logout</button>
      </p>
    </div>
    <div class="admin" v-if="isadmin">
      <p>
        Admin: <button  v-on:click="userManager"  class="nav-button">Manage Users</button>, 
        <button class="nav-button">Check Game Statistics</button> 
      </p>
    </div>
  </div>
  `,
})