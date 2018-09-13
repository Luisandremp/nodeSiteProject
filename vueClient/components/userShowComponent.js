
Vue.component('userShow', {
    data: function () {
      return {
        name: "",
        email: "",
        id: "",
        isAdmin: false
      }
    },
    props: ['user', 'index'],
    methods:{
       
    },
    mounted: function () {
      this.name = this.user.name;
      this.email = this.user.email;
      this.isAdmin = this.user.isAdmin;
      this.id = this.user.id

    },
    template:  ` 
    <tr>
    <td>{{ name }}</td>
    <td>{{ email }}</td>
    <td v-if="isAdmin">Admin</td>
    <td v-else>User</td>             
    <td><button id="btnEdit"  v-on:click="$emit('edit-user', index)">Edit</button></td>
    <td><button id="btnDelete" v-on:click="$emit('deleteUser', id)">Delete</button></td>
    </tr>
    ` 
  })