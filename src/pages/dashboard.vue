<template>
  <div>
      Here go the statistic informations
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default{
    name: 'Dashboard',

    computed: {
      ...mapGetters(['loggedUser'])
    },

    data: () => ({

    })
  }
</script>
