
Vue.component('userEdit', {
    data: function () {
      return {
        username: "",
        userEmail: "",
        userId: "",
        userRole: "",
        errors:[]
      }
    },
    props: ['user', 'index']
    ,
    mounted: function () {
        this.username = this.user.name;
        this.userEmail = this.user.email;
        this.userId = this.user.id;
        if (this.userRole) {
            this.userRole = 1;
        }else{
            this.userRole = 0; 
        }
        
    },
    methods:{
        update: function(){
            context = this;
            this.errors=[];
            if (this.userRole) {
                this.userRole = true;
            }else{
                this.userRole = false; 
            }
            const user = {
                'name': this.username, 
                'email': this.userEmail, 
                'id': this.userId,
                'admin': this.userRole
              }
            axios.defaults.headers.common['Authorization'] = "bearer "+localStorage.getItem('jwtToken');
            axios.put(window.BASEURL+'/users/'+user.id, user)
              .then(function (response) {
                context.$emit('showUser', context.index)
              })
              .catch(function (error) {
                context.errors= error.response.data.errors;
                console.log(context.errors)
                if (error.response.status === 401) {
                    Auth.logout();
                }  
              });
        },
        deleteAction: function(){
            $emit('deleteUser', userId);
            $emit('showUser', index);
        }

    },

    template:  ` 
    
    
    <tr>
    
        <td>
            <div class="error-list" v-show="errors.length">
                    <ul>
                        <li v-for="error in errors" v-if="error.param=='name'">
                        
                            {{ error.msg }}
                        </li>
                    </ul>
            </div>
            <input type="text" name="name" id="" v-model:value="username">
        </td>
        <td>
            <div class="error-list" v-show="errors.length">
                    <ul>
                        <li v-for="error in errors" v-if="error.param=='email'">
                            {{ error.msg }}
                        </li>
                    </ul>
            </div>

            <input type="email" name="email" id="" v-model:value="userEmail"></td>
        <td>
            <select name="Role" id=""v-model:value="userRole">
                <option value="0">User</option>
                <option value="1">Admin</option>
            </select>
        </td>
        <td>
            <button id="btnEdit" v-on:click="update">Confirm</button>
            <button id="btnEdit" v-on:click="$emit('showUser', index)">Cancel</button>
        </td>
        <td><button id="btnDelete" v-on:click="deleteAction">Delete</button></td>
    </tr>
    
    ` 
  })