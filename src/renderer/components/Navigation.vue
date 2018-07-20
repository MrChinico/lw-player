<template lang="pug">
  div#navigation
    div.list-operating
      div.add(
        @click = "addMenuActive = !addMenuActive"
        :class = "{ active: addMenuActive }"
        ) 添加
        div.add-menu( v-if = "addMenuActive" )
          div 媒体文件
            input(type="file")
          div 媒体文件夹
          div 从网络资源中获取（URL）
      div.clear 清空
    div.media-mode
      div(v-if = "$store.state.player.mode == 'audio'") 均衡器
      div(
        @click="changePlayerMode('audio')"
        :class="{ active:$store.state.player.mode == 'audio' }"
        ) 音频
      div(
        @click="changePlayerMode('video')"
        :class="{ active:$store.state.player.mode == 'video' }"
        ) 视频
      div(
        @click="changeMediaList"
        :class="{ active:$store.state.player.mediaList }"
        ) 媒体列表

</template>

<script>
export default {
  data() {
    return {
      addMenuActive: false
    }
  },
  methods: {
    changePlayerMode( mode ) {
      this.clearMenuState()
      this.$store.dispatch( 'changePlayerMode', { mode: mode } )
    },
    changeMediaList() {
      this.clearMenuState()
      this.$store.dispatch( 'changeMediaList', { active: !this.$store.state.player.mediaList } )
    },
    clearMenuState() {
      this.addMenuActive = false
    }
  },
}
</script>


<style lang="stylus">
  @import '../layout/navigation';

</style>
