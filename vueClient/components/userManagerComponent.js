Vue.component('userManager', {
    data: function () {
      return {
          users: {},
        isEditing:{}
      }
    },
    props: [],
    methods: {
        updateAuth: function(){
            if (Auth.isLogged) {
                this.user = Auth.user;
                this.username  =  Auth.user.name;
                this.email = Auth.user.email;          
            }else{
                changePage("login");
            }
        },
        getPlayers: async function(){
            axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
            const response = await axios.get(window.BASEURL+'/users/',)
            .catch(function (error) {
                if (error.response) {
                  if (error.response.status === 401) {
                      Auth.logout();
                  }  
                }});
            return response.data;
        },
        editUser:  function (index) {
            
            this.$set(this.isEditing, index, true)

          },
        showUser: async function (index) {
            this.users = await this.getPlayers();
            console.log(this.users)
            this.$set(this.isEditing, index, false)
            
          },
        deleteUser: async function(id){
            axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
            const response = await axios.delete(window.BASEURL+'/users/'+id,)
            .catch(function (error) {
                if (error.response) {
                  if (error.response.status === 401) {
                      Auth.logout();
                  }  
                }});
                this.users = await this.getPlayers();
                return response.data;
        }
             
    }, 
   
    mounted: async function () {
        this.users = await this.getPlayers();
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
   
        <table>
        
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody v-for="(user, index) in users">
                
                <userEdit  v-on:deleteUser="deleteUser"  v-on:showUser="showUser" v-bind:user="user"  v-bind:index="index" v-if="isEditing[index]"></userEdit>
                <userShow v-on:deleteUser="deleteUser"  v-on:edit-user="editUser"  v-bind:user="user" v-bind:index="index" v-else></userShow>
                                 
               
            </tbody>
        </table>
            
    `   
})