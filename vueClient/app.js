app = new Vue({
  el: '#app',
  data: {
    isAdmin: false,
    isLogged: false,
    currentPage: "login"
  },
  created: function () {
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
        axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
        axios.get(`http://localhost:5000/`)
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
      logout: function() {
        localStorage.removeItem('jwtToken')
        Auth.user = null; 
        Auth.isLogged= false;
        Auth.isAdmin= false;
        VUEevent.$emit("updateAuth");
      },
      localLogin: function(email, password){       
        let success= false;
        axios.post('http://localhost:5000/auth/login2', {'email': email, 'password': password})
        .then(function (response) {
            Auth.user = response.data.user;
            localStorage.setItem('jwtToken', response.data.token)
            Auth.isLogged = true;
            Auth.isAdmin = true;
            success=true;
            
        })
          .catch(function (error) {
            
            Auth.logout();
            success=false;
        })
        .then(function () {
          VUEevent.$emit("updateAuth");
          return success;
        });
    }
    };
    window.Socket= {
      ipAddress: 'localhost',
      port: '3000',
      connection: {},
      createConnection: function () {  this.connection = io.connect('http://' + this.ipAddress + ':' + this.port, { transport : ['websocket'] }); }
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


  
