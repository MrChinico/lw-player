<template lang="pug">
  div#player
    div.player-view 
      div.media-info
        div.media-title {{mediaInfo.title}}
        div.media-detail {{mediaInfo.artist}} - {{mediaInfo.album}}
    div.time-bar
      div.current-time {{currentTime}}
      div.time-control.control-progress(
        ref = "timeControlNode"
        @mousedown = "setProgressStart( 'timeControlNode' )"
        @mousemove = "setProgressing"
        @mouseup = "setProgressEnd( 'timeControlNode' )"
      )
        div.progress
          div(ref = "timeControlNodeProgress")
            div
      div.duration {{mediaInfo.duration}}
    div.player-control
      div.mode
        div
          img(src="../assets/list.png")
        div
          img(src="../assets/loop.png")
        div
      div.control
        div
        div(@click = "playMedia")
        div
      div.volume
        div
        div.volume-control.control-progress
          div.progress
            div
              div
      
</template>

<script>
export default {
  data() {
    return {
      setProgressSwitch: false,
      currentTime: '00:00'
    }
  },
  watch: {
    playingState() {
      if(this.playingState){
        console.log('播放')
        this.playingLoop()
      } else {
        console.log('暂停')
      }
    },
    mediaInfo() {
      this.$refs.timeControlNodeProgress.style.width = '0%'
    }
  },
  computed: {
    playingState() {
      return this.$store.state.player.playingMediaArea.Playing
    },
    mediaInfo() {
      console.log('状态改变B')
      return this.$store.getters.playerAudioMediaInfo
    }
  },
  methods: {
    setProgressStart( node ) {
      this.setProgressSwitch = true
      console.log( this.setProgressSwitch )
    },
    setProgressing( e ) {
      if( this.setProgressSwitch ) {
        console.log( e.pageX )
      }
    },
    setProgressEnd( node ) {
      this.setProgressSwitch = false
      console.log( this.setProgressSwitch )
      this.$store.state.testObj.value = 3
    },
    playMedia() {
      let audioNode = this.$store.state.player.audioNode
      if(this.playingState){
        audioNode.pause()
        this.$store.state.player.playingMediaArea.Playing = false
      } else {
        audioNode.play()
        this.$store.state.player.playingMediaArea.Playing = true
      }
    },
    toStdTimeFormat( duration ){
      let
        m = Math.floor( duration / 60 ),
        s = Math.floor( duration % 60 )
      if(m<10) m = '0' + m
      if(s<10) s = '0' + s
      return m + ':' + s
    },
    playingLoop() {
      if(this.playingState){
        let audioNode = this.$store.state.player.audioNode
        let timeControlNodeProgress = this.$refs.timeControlNodeProgress
        timeControlNodeProgress.style.width = (( audioNode.currentTime / audioNode.duration ) * 100).toFixed(2) + '%'
        // console.log(timeControlNode.childNode)
        console.log( (( audioNode.currentTime / audioNode.duration ) * 100).toFixed(2) + '%' )
        this.currentTime = this.toStdTimeFormat( audioNode.currentTime )

        setTimeout(this.playingLoop, 1000);
      }
    }
  }
}
</script>


<style lang="stylus">
  @import '../layout/player';

</style>

