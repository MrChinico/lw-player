<template lang="pug">
  div#title-bar.nt Lw 音频播放器
    div.content
      div.icon
      div.darg-area
      div.console
        div.min(@click="windowControl('min')") ━
        div.max(@click="windowControl('max')") ☐
        div.close(@click="windowControl('close')") ✕
</template>
<script>

import { ipcRenderer } from 'electron'  // 引入IPC渲染器 用于与Electron主进程进行通讯

export default {
  methods: {
    windowControl( type ) {
      switch( type ) {
        case 'min':
          ipcRenderer.send('window-min')
          break
        case 'max':
          alert('简单模式')
          break
        case 'close':
          ipcRenderer.send('window-close')
          break
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '../layout/title-bar';

</style>
