app = new Vue({
  el: '#app',
  data: {
    isAdmin: false,
    isLogged: false,
    currentPage: "login"
  },
  created: function () {
    window.BASEPORT = ":5000"
    window.GAMEPORT = ':3000',
    //window.BASEIP = "http://192.168.43.154";
    window.BASEIP = "http://192.168.20.102";
    window.BASEURL = BASEIP+BASEPORT;
    window.GAMEURL = BASEIP+GAMEPORT;

    axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');

    //an vue object that will be used to emit events to all components
    window.VUEevent = new Vue({
      methods: {
        test:function(){console.log("test")}
      }
    });
    // currentPage will be used and updated to do Routing
    window.changePage = function(newPage){
      currentPage = newPage;
      VUEevent.$emit("updateCurrentPage");
    }
    window.currentPage = this.currentPage;
    //Authentification object to give access to some parts of the site.
    window.Auth= {
      isLogged: this.isLogged,
      isAdmin: this.isAdmin,
      user: null,
      checkAuth(){
        axios.get(window.BASEURL)
        .then(response => {
          Auth.user = response.data; 
          Auth.isLogged= true;
          Auth.isAdmin= true;
        })
        .catch(e => {
            console.log('error', e);
            Auth.user = null; 
            Auth.isLogged= false;
            Auth.isAdmin= false;
        })
        .then(function () {
          VUEevent.$emit("updateAuth");
        });
        
      },
      logout: async function() {
        await localStorage.removeItem('jwtToken')
        Auth.user = null; 
        Auth.isLogged= false;
        Auth.isAdmin= false;
        VUEevent.$emit("updateAuth");
        changePage("login")
      },
      
    };
    window.Socket= {
      connection: {},
      createConnection: function () {  this.connection = io.connect(GAMEURL, { transport : ['websocket'] }); }
    }

  },
  mounted: function () {
    this.$nextTick(function () {
      VUEevent.$emit("updateAuth");
      VUEevent.$emit("updateCurrentPage");

      const context = this;
      VUEevent.$on("updateCurrentPage", function (){
        context.updateCurrentPage();
      });
      VUEevent.$on("updateAuth", function (){
        context.updateAuth();
      });

    })
  },
  methods: {
    updateCurrentPage: function (){
      this.currentpage = currentPage;
    },
    updateAuth: function(){
      this.isLogged = Auth.isLogged;
      this.isAdmin= Auth.isAdmin;
    }
  }
})


  
