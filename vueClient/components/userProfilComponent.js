Vue.component('profil', {
    data: function () {
      return {
        user: null,
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        errors: []
      }
    },
    props: [],
    methods: {
        deleteUser: function(){
        axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
        axios.delete('http://localhost:5000/users/'+Auth.user.id, {withCredentials: true})
        .then(function (response) {
            console.log(": ", response)
            Auth.logout();
        
        })
        .catch(function (error) {
            console.log("error: ", error)
            success=false;
        })
        .then(function () {
    
        });
        },
        changeUserDetails: function(){
            axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
            axios.put('http://localhost:5000/users/'+Auth.user.id, {name: this.username, email: this.email}, {withCredentials: true})
            .then(function (response) {
                console.log(": ", response)
                Auth.checkAuth();
            
            })
            .catch(function (error) {
                console.log("error: ", error)
                success=false;
            })
            .then(function () {
        
            });
            },
            modifyPassword: function(){
                axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
                axios.put('http://localhost:5000/users/modifyPassword/'+Auth.user.id, {oldPassword: this.oldPassword, newPassword: this.newPassword, confirmPassword: this.confirmPassword}, {withCredentials: true})
                .then(function (response) {
                    console.log(": ", response)
                    //Auth.checkAuth();
                
                })
                .catch(function (error) {
                    console.log("error: ", error)
                    success=false;
                })
                .then(function () {
            
                });
                },
        updateAuth: function(){
            if (Auth.isLogged) {
                this.user = Auth.user;
                this.username  =  Auth.user.name;
                this.email = Auth.user.email;          
            }else{
                changePage("login");
            }
        }     
    },
    mounted: function () {
        this.updateAuth();
         //create a context variable to pass to the callback
        const context = this;
        //listen to the event on my global events object and update the corresponding information
        VUEevent.$on("updateAuth", function (){
            context.updateAuth();
        });


    },
    template: 
    `
    <div class="frame col">
        <h2>
            Profil
        </h2>
        <div class="row">
            <div class="side_by_side col">
                <label for="screen_name">Screen Name:</label>
                <input v-model="username" type="text" name="" id="screen_name"">
                <label for="email">E-Mail:</label>
                <input  v-model="email" type="text" name="" id="email">
                <button  v-on:click="changeUserDetails">Save Changes</button>
            </div>
            <div class="side_by_side col">
                <label for="old_password">Old Password</label>
                <input v-model="oldPassword" type="password" name="" id="oldPassword">
                <label for="new_password">New Password</label>
                <input v-model="newPassword" type="password" name="" id="newPassword">
                <label for="confirm_password">Confirm New Password</label>
                <input v-model="confirmPassword" type="password" name="" id="confirmPassword">
                <button  v-on:click="modifyPassword">Change Password</button>
            </div>
        </div>
        <div>
            <div><p>Warning</p>
                This action will delete all information relative to your user. This process is irreversable
            </div>
            
            <button  v-on:click="deleteUser">Delete Profil</button>
        </div>
    </div>
            
    `   
})