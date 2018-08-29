// Define a new component called button-counter
Vue.component('content-base', {
    data: function () {
      return {
        "currentpage": currentPage 
      }
    },
    props: [],
    methods: {
    },
    mounted: function () {
      this.$nextTick(function () {
        VUEevent.$emit("updateAuth");
        VUEevent.$emit("updateCurrentPage");
  
        const context = this;
        VUEevent.$on("updateCurrentPage", function (){
          context.updateCurrentPage();
        });
      })
    },
    methods: {
      updateCurrentPage: function (){
        this.currentpage = currentPage;
      }
    },
    template: `
    <div class="container">
      <component v-bind:is="currentpage"></component>
    </div>
    `
  })