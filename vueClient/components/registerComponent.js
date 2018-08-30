Vue.component('register', {
    data: function () {
      return {
        username: "",
        email: "",
        password: "",
        passwordMatch: "",
        errors: []
      }
    },
    props: [],
    methods: {
        register: function(){
            context = this;
            const user = {
                'name': this.username, 
                'email': this.email, 
                'password': this.password, 
                'passwordMatch': this.passwordMatch
              }
            /*
            r =request.register(user)
            if (r) {
                //login
                //redirect sur main page           
            }else{
                //errors = r.errors
            }
            */
            axios.post('http://localhost:5000/auth/register', user)
              .then(function (response) {
                Auth.user = response.data.user;
                localStorage.setItem('jwtToken', response.data.token)
                Auth.isLogged = true;
                Auth.isAdmin = true;
                VUEevent.$emit("updateAuth");
              })
              .catch(function (error) {
                context.errors= error.response.data.errors;
              });
        },
        updateAuth: function(){
            if (Auth.isLogged) {                
                changePage("rooms");
            }
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
    <div class="frame">
        <div class="error-list" v-show="errors.length">
            <ul>
                <li v-for="error in errors">
                    {{ error.msg }}
                </li>
            </ul>
        </div>
        <h2>register</h2>
            <form action="">
                <div class="row">
                    <label for="name">Screen Name:</label>
                    <input type="text" id="name" v-model.lazy.trim="username">
                </div>
                <div class="row">
                    <label for="email">email:</label>
                    <input type="text" id="email" v-model.lazy.trim="email">
                </div>
                <div  class="row">
                    <label for="password">password</label>
                    <input type="password" id="password" v-model.lazy.trim="password">
                </div>
                <div  class="row">
                    <label for="passwordmatch">Confirm password:</label>
                    <input type="password" id="passwordmatch" v-model.lazy.trim="passwordMatch">
                </div>
                <button @click.prevent="register">Register</button>
            </form>
    </div>
            
    `   
})