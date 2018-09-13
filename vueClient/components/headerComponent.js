// Define a new component called button-counter
Vue.component('page-header', {
    data: function () {
      return {
        title: "JShooter"
      }
    },
    methods: {
      home(){
        changePage('rooms');
      }
    },
    props: [],
    template: `
    <div class="header">
      <div class="container top">
        <h1 v-on:click="home">{{title}}</h1>
        <nav-options ></nav-options>
      </div>
    </div>`
  })

  