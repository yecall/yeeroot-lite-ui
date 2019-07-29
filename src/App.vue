<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created(){
      // document.title=this.$t('title')
  },
}
</script>

<style scoped lang="stylus">
#app {

}
</style>
