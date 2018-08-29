app = new Vue({
  el: '#app',
  data: {
    isAdmin: false,
    isLogged: false,
    userName: "placeholder",
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
      user: {name: this.userName}
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
      this.userName= Auth.user.name;
    }
  }
})


  
