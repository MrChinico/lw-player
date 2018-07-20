import Vue from 'vue'
import Vuex from 'vuex'

// import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseInfo: {
      applicationName: 'Lightweight Player',
      version: '1.0.0',
    },
    player: {
      audioNode: new Audio(),
      videoNode: document.createElement('video'),
      mode: 'audio',
      mediaList: true,
      audioMediaList: [
        {name: '默认', default: true, media: []},
        {name: '示例', default: true, media: []},
      ],
      videoMediaList: [],
      playingMediaArea: {
        type: 'default',
        tagIndex: -1,
        mediaIndex: -1,
        Playing: false
      },
    },
  },

  mutations: {
    changePlayerMode( { player }, payload ) {
      player.mode = payload.mode
    },
    changeMediaList( { player }, payload ) {
      player.mediaList = payload.active
    },
    addNewMedia( { player }, payload ) {
      player.audioMediaList[payload.listNum].media.push(payload)
    }
  },

  getters: {
    playerAudioMediaInfo( state ) {
      let a = state.player.playingMediaArea
      console.log('状态改变A')
      if(state.player.playingMediaArea.type != 'default'){
        let mediaInfo = state.player.audioMediaList[ state.player.playingMediaArea.tagIndex ].media[ state.player.playingMediaArea.tagIndex ]

        return {
          title: mediaInfo.name,
          artist: mediaInfo.artist,
          album: mediaInfo.album,
          duration: mediaInfo.duration
        }
      }
      else {
        return {
          title: '欢迎使用Lw音频播放器',
          artist: '添加一个媒体到媒体列表',
          album: '开始播放',
          duration: '00:00'
        } 
      }
    }
  },
  
  actions: {
    changePlayerMode( { commit }, payload ) {
      commit('changePlayerMode', payload )
    },
    changeMediaList( { commit }, payload ) {
      commit('changeMediaList', payload )
    },
    addNewMedia( { commit }, payload ) {
      commit('addNewMedia', payload )
    }
  }
  // modules,
  // strict: process.env.NODE_ENV !== 'production'
})
