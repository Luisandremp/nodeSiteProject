
Vue.component('nav-options', {
  data: function () {
    return {
      currentpage: currentPage,
      isRegistring: (this.currentpage == "register"),
      isLoggingIn: (this.currentpage == "login"),
      islogged: Auth.isLogged,
      isadmin: Auth.isAdmin,
      username: Auth.user.name
    }
  },
  props: [],
  template:` 
  <div class="nav">
    <div class="auth">
      <button v-show="!islogged && !isRegistring"  v-on:click="register">Register</button>
      <button v-show="!islogged && !isLoggingIn" v-on:click="login">Login</button>
      <span class="welcome" v-show="islogged"> Wellcome User {{username}}</span>
    </div>
    <div class="menu" v-show="islogged">  
      <p>
        Check your <button>Stats</button>,
        Change your <button>Profile</button>,
        or <button v-on:click="logout">Logout</button>
      </p>
    </div>
    <div class="admin" v-show="isadmin">
      <p>
        Since you are an admin you can also <button>Manage Users</button>, 
        <button>Check Game Statistics</button> 
        <button>Fine Tune The Game</button> 
      </p>
    </div>
  </div>
  `,
  mounted: function () {
    //create a context variable to pass to the callback
    const context = this;
    //listen to the event on my global events object and update the corresponding information
     
    VUEevent.$on("updateCurrentPage", function (){
      context.updateCurrentPage();
    });
    VUEevent.$on("updateAuth", function (){
      context.updateAuth();
    });
    
    
  },  
  methods: {
    register(){
      changePage('register');
    },
    login(){
      Auth.isLogged = true;
      changePage('login');
      VUEevent.$emit("updateAuth");
    },
    logout(){
      Auth.isLogged = false;
      VUEevent.$emit("updateAuth");
    },
    updateCurrentPage: function (){
      this.currentpage = currentPage;
      this.isRegistring= (this.currentpage == "register");
      this.isLoggingIn= (this.currentpage == "login");
    },
    updateAuth: function(){
      this.islogged = Auth.isLogged;
      this.isadmin= Auth.isAdmin;
      this.username= Auth.user.name;
    }

  }
})