<template lang="pug">
  div#root(
    :class = "{focus:windowFocus}"
    ref = "root"
    )
    TitleBar
    Player
    Navigation
    MediaList
    ApplicationInfo
  // router-view
</template>

<script>
  export default {
    name: 'lw-player',
    components: {
      TitleBar: require('@/components/TitleBar').default,
      Player: require('@/components/Player').default,
      Navigation: require('@/components/Navigation').default,
      MediaList: require('@/components/MediaList').default,
      ApplicationInfo: require('@/components/ApplicationInfo').default,
    },
    data() {
      return {
        windowFocus: true
      }
    },
    methods: {
      windowSizeUpdate() {
        let height = getComputedStyle(this.$refs.root).height.replace('px','')        
        window.resizeTo(640, height)
      }
    },
    mounted() {
      onblur = () => {
        this.windowFocus = false
      }
      onfocus = () => {
        this.windowFocus = true
      }
      this.windowSizeUpdate()
    },
  }
</script>

<style lang="stylus">
  @import './layout/global';

</style>
