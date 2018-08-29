// Define a new component called button-counter
Vue.component('page-header', {
    data: function () {
      return {
        title: "JShooter"
      }
    },
    props: [],
    template: `
    <div class="header">
      <div class="container top">
        <h1>{{title}}</h1>
        <nav-options ></nav-options>
      </div>
    </div>`
  })

  