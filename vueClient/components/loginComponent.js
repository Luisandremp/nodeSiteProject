Vue.component('login', {
    data: function () {
      return {
            email: "",
            password: ""
      }
    },
    props: [],
    methods: {
        
        facebookLogin: function(){
            //window.location.href = "http://localhost:5000/auth/facebook";

            axios('http://localhost:5000/auth/facebook', {
                method: 'HEAD',
                mode: 'no-cors',
            }).then((response) => {
                console.log(response);
            }).catch((e) => {
                console.log(e);
            });


        },
        googleLogin: function(){
           // window.location.href = "http://localhost:5000/auth/google";
            fetch('http://localhost:5000/auth/google', { mode: 'no-cors' })
            .then(function(response) {
                
                console.log("result", response)
            }).catch(function (error) {
                console.log(error)
            })
        },
        localLogin: function(){  
           Auth.localLogin(this.email, this.password);

        },
        updateAuth: function(){
            if (Auth.isLogged) {
                changePage("rooms");
            } ;
        }
        
    },
    mounted: function () {
        Auth.checkAuth();
         //create a context variable to pass to the callback
        const context = this;
        //listen to the event on my global events object and update the corresponding information
        VUEevent.$on("updateAuth", function (){
            context.updateAuth();
        });


    },
    template: 
    `
    <div class="loginFrame frame">
        <h2>Log In</h2>
        <div class="row">
            <div class="local-login">
                    <form action="">
                        <div class="row">
                            <label for="email">email:</label>
                            <input type="text" id="email" v-model.lazy.trim="email">
                        </div>
                        <div  class="row">
                            <label for="password">password</label>
                            <input type="password" id="password" v-model.lazy.trim="password">
                        </div>
                        <button @click.prevent="localLogin">Login</button>
                    </form>
            </div>
            <div class="oneclick-login">
                <button v-on:click="facebookLogin">Facebook</button>
                <button  v-on:click="googleLogin">Google</button>
                <button>Twitter</button>
            </div>
        </div>      
        <div class="anonymous-login row">
            <p class="warning">
            If you don't sign up you wont be able to choose a screen name, and your progress wont be saved!
            </p>
            <button>Don't sign up</button>
        </div>
    </div>
    `   
})