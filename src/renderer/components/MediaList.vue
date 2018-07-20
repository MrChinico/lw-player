<template lang="pug">
  div#media-list(v-if = "$store.state.player.mediaList")
    div.audio-list(
      v-if = "$store.state.player.mode == 'audio'"
      )
      div.header
        div.tags 标签
        div
      div.body
        div.tags(@mousedown = "showTagManageMenu")
          div.tag-child(
            v-for = "(list, index) of audioMediaList"
            @click = "activeTagIndex = index"
            :class = "{active: index == activeTagIndex}"
            ) {{list.name}}
          div(ref="newTag") +
            input(@change="test" v-if="newTag || rename")
        div()
          div(
            v-for = "(media, index) of audioMediaList[activeTagIndex].media"
            @click = "tap = index"
            @mousedown = "showContextMenu( $event, { \
              type: 'audioMediaList', \
              name: 'mediaManageMenu', \
              tagIndex: activeTagIndex, \
              mediaIndex: index \
              } )"
            )
            div.icon(
              :class = "{ active: activeTagIndex == $store.state.player.playingMediaArea.tagIndex && index == $store.state.player.playingMediaArea.mediaIndex }")
            div.title {{index+1}}. {{media.name}}
            div.duration {{media.duration}}
          div +
            input(@change="addNewMedia" type="file")
    div.video-list(v-if = "$store.state.player.mode == 'video'") 视频媒体列表组件运行正常
    
    div.context-menu(
      ref     = "contextMenu"
      v-show  = "contextMenuDisplayState"
    )
      button(
        v-for     = "option of contextMenuTemplate[ contextMenuTemplate.type ]"
        @click    = "contextMenuActions( option.action )"
        :disabled = "option.disabled"
      ) {{option.name}}
</template>

<script>
import fs from 'fs'
import tags from 'jsmediatags'
import { file } from 'babel-types';
export default {
  data() {
    return {
      activeTagIndex: 0,  // 当前活动标签索引值

      contextMenuTemplate: {  // 上下文菜单模板
        type: 'default',
        default: [],
        audioMediaList: [
          {name: '播放', action: 'audioMediaPlay', disabled: false},
          {name: '删除', action: 'audioMediaRemove', disabled: false}
        ]
      },

      contextMenuDisplayState: false, // 上下文菜单显示状态

      playingMediaArea: {
        type: '',
        tagIndex: -1,
        mediaIndex: -1 
      },

      selectMediaArea: {  // 指向媒体信息缓存区域
        type: '',
        tagIndex: -1,
        mediaIndex: -1
      },
      tap: 1,
      audioMediaList: [],
      tagManageMenuActive: false,
      audioManageMenuActive: false,
      dontShow: false,
      newTag: false,
      rename: null,
      audioPath: null
    } 
  },
  methods: {
    dataInit() {
      this.audioMediaList = this.$store.state.player.audioMediaList
      console.log(this.$store.state.player.audioMediaList)
    },
    toStdTimeFormat( duration ){
      let
        m = Math.floor( duration / 60 ),
        s = Math.floor( duration % 60 )
      if(m<10) m = '0' + m
      if(s<10) s = '0' + s
      return m + ':' + s
    },
    contextMenuActions( action ) {
      switch ( action ) {
        case 'audioMediaPlay':
          let audioNode = this.$store.state.player.audioNode

          audioNode.src = this.$store.state.player.audioMediaList[ this.selectMediaArea.tagIndex ].media[ this.selectMediaArea.mediaIndex ].path
          audioNode.play()

          // 设置正在播放的媒体状态
          this.$store.state.player.playingMediaArea.tagIndex    = this.selectMediaArea.tagIndex
          this.$store.state.player.playingMediaArea.mediaIndex  = this.selectMediaArea.mediaIndex
          this.$store.state.player.playingMediaArea.type = 'audio'
          
          this.$store.state.player.playingMediaArea.Playing = true
          console.log(this.$store.state.player.playingMediaArea)
        break

        case 'audioMediaRemove':
          this.$store.state.player.audioMediaList[ this.selectMediaArea.tagIndex ].media.splice( this.selectMediaArea.mediaIndex, 1)

        break
      }

      // 关闭上下文菜单
      this.contextMenuDisplayState = false
    },
    showContextMenu( e, contextMenu ) {
      if ( e.button !== 2 ) return  // 非右键操作结束方法
      
      let
        contextMenuNode = this.$refs.contextMenu // 获取目标上下文菜单的DOM节点

      this.selectMediaArea.tagIndex   = contextMenu.tagIndex  
      this.selectMediaArea.mediaIndex = contextMenu.mediaIndex  // 设定选择媒体索引

      // 设置上下文类型

      this.contextMenuTemplate.type = contextMenu.type

      // 依据鼠标事件来确定上下文菜单坐标
      contextMenuNode.style.top   = e.pageY + 'px'
      contextMenuNode.style.left  = e.pageX + 'px'

      // 开启上下文菜单
      this.contextMenuDisplayState = true

    },
    showTagManageMenu( e ) {
      if( e.button !== 2) return  // 非右键操作直接返回

      let
        tagManageMenuNode = this.$refs.tagManageMenu,
        isMenu = !!!e.target.className.match(/tag-child/)
      this.dontShow = false
      if( isMenu ) {
        this.dontShow = true
      }
      tagManageMenuNode.style.top = e.pageY + 'px'
      tagManageMenuNode.style.left = e.pageX + 'px'
      this.tagManageMenuActive = true
    },
    showTagManageMenuSelect( mode ) {
      this.tagManageMenuActive = false
      switch( mode ) {
        case 'new':
          this.tagManageMenuNewTag()
          break
        case 'delete':
          console.log('删除')
          break
        case 'rename':
          console.log('重命名')
          break
      } 
    },
    tagManageMenuNewTag() {
      this.newTag = true
    },
    test() {
      console.log(123)
      this.newTag = false
    },
    pq(e) {
      e.preventDefault()
      console.log(e)
    },
    addNewMedia(e) {
      tags.read(e.target.files[0],{
        onSuccess: tag => {
          var 
            audioNode = new Audio(), // 实例化临时音频节点用于提取信息
            fileNode  = e.target.files[0], // 获取添加媒体的文件节点
            tagNode   = tag.tags

          audioNode.src = fileNode.path // 载入媒体到临时音频节点

          audioNode.onloadedmetadata = (e) => {

            let audioInfo = e.path[0]
            this.$store.dispatch( 'addNewMedia', {
              listNum:  this.activeTagIndex,
              name:     fileNode.name,
              path:     fileNode.path,
              album:    tagNode.album,
              artist:   tagNode.artist,
              duration: this.toStdTimeFormat( audioInfo.duration )
            } )
          }

          console.log(this.$store.state.player.audioMediaList)
        },
        onError: function(error){
          console.log(':(', error.type, error.info)
        }
      })
    },
    deleteMedia() {

    },
    playThisAudioMedia( data ) {
      this.$store.state.player.audioNode.src = this.audioPath
      this.$store.state.player.audioNode.play()
      this.audioManageMenuActive = false
    }
  },
  updated() {
    this.$parent.windowSizeUpdate()
  },
  mounted() {
    this.dataInit()
    // alert(fs.rename)
  }
}
</script>

<style lang="stylus">
  @import '../layout/media-list';

</style>

