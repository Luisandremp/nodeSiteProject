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
            window.location.href = "http://localhost:5000/auth/facebook";   
        },
        googleLogin: function(){
            window.location.href = "http://localhost:5000/auth/google";
        },
        localLogin: async function(){
                       

            axios.post('http://localhost:5000/auth/login2', {'email': this.email, 'password': this.password})
            .then(function (response) {
                console.log('response: ',response.data);
                
                localStorage.setItem('jwtToken', response.data.token)
                
                
                Auth.isLogged = true;
                Auth.isAdmin = true;
                VUEevent.$emit("updateAuth");
                //changePage("rooms");

            })
            .catch(function (error) {
                console.log('error: ',error);

            })
            .then(function () {
                // always executed
            });
            

        }
    },
    mounted: function () {
        axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem('jwtToken');
        axios.get(`http://localhost:5000/auth/`)
        .then(response => {

        console.log(response.data);
            
        })
        .catch(e => {
            console.log('error', e);

        })
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