Vue.component('login', {
    data: function () {
      return {
            email: "",
            password: "",
            errors: []
      }
    },
    props: [],
    methods: {
        /*
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
        },*/
        localLogin: function(){       
            const context = this;
            axios.post(window.BASEURL+'/auth/login3', {'email': this.email, 'password': this.password})
            .then(async function (response) {
                Auth.user = response.data.user;
                await localStorage.setItem('jwtToken', response.data.token)
                Auth.isLogged = true;
                Auth.isAdmin = Auth.user.isAdmin;
                
            })
              .catch(function (error) {
                context.errors= error.response.data.errors;            
                Auth.logout();
            })
            .then(function () {
              VUEevent.$emit("updateAuth");
            });
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

        <div class="error-list" v-show="errors.length">
            <ul>
                <li v-for="error in errors">
                    {{ error.msg }}
                </li>
            </ul>
        </div>

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
            <div class="anonymous-login">
                <p class="warning">
                If you don't sign up you wont be able to choose a screen name, and your progress wont be saved!
                </p>
                <button>Don't sign up</button>
            </div>
            <!--
            <div class="oneclick-login">
                <button v-on:click="facebookLogin">Facebook</button>
                <button  v-on:click="googleLogin">Google</button>
                <button>Twitter</button>
            </div>
            -->
        </div>      
        
    </div>
    `   
})