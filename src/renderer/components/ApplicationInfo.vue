<template lang="pug">
  div#application-info
    div {{applicationName}} {{version}}
    div 设置
</template>

<script>
export default {
  data() {
    return {
      applicationName: null,
      version: null
    }
  },

  methods: {
    dataInit() {
      this.applicationName = this.$store.state.baseInfo.applicationName
      this.version = this.$store.state.baseInfo.version
    }
  },

  mounted() {
    this.dataInit()
  }
}
</script>


<style lang="stylus">
  @import '../layout/application-info';

</style>
