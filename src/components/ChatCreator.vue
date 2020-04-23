<template>
  <div class="chat-creator">
    <div>
      <div class="text-background" v-bind:style="backgroundStyle()">
        <div class="text-renderer">
          <div v-for="(component, compIndex) in components" :key="compIndex" v-bind:style="component.compStyle()">
            <img v-for="(t, ti) in component.text" :key="ti" v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t)" v-bind:title="t"/>
          </div>
        </div>
      </div>
    </div>
    <ChatComponent v-for="(item, index) in components" v-bind:index="index" v-bind:text="item.text" :key="index" @textChange="onText" @fontChange="onFont" @colorChange="onColor">
      <!--      <component :is="item" :key="index"></component>-->
    </ChatComponent>

    <md-button v-on:click="addComponent()">Add Component</md-button>

    <!--    {{ // components }}-->
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .text-background {
    image-rendering: pixelated;
    background-size: contain;
  }
  .text-renderer {
    padding: 10px;
  }
</style>

<script lang="ts">
    import { Component, Emit, Prop, PropSync, Provide, Vue, Watch } from 'vue-property-decorator'
    import ChatComponent from '@/components/ChatComponent.vue'
    import { MCASSET_VERSION } from '@/vars'

    @Component({
        components: {
            ChatComponent
        }
    })
    export default class ChatCreator extends Vue {
        components: ChatComponent[] = [];

        backgroundTexture = 'dirt';

        availableFonts: string[] = [];
        fontData: object = {};
        //
        // @Watch('components', { deep: true })
        // componentChanged (val: any, oldVal: any) {
        //     window.console.log(val)
        // }

        // get components () {
        //     return this.components_.map((c: any) => {
        //         c.fontUrl = 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/' + c.font
        //         return c
        //     })
        // }

        // fontUrl (font: string) {
        //     return 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/' + font
        // }

        backgroundStyle () {
            return {
                background: 'url("https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/20w17a/assets/minecraft/textures/block/' + this.backgroundTexture + '.png")'
            }
        }

        onText (data: any) {
            window.console.log('onText: ' + JSON.stringify(data))
            this.setCompProp(data.index, 'text', data.value)
        }

        onFont (data: any) {
            window.console.log('onFont: ' + data)
            this.setCompProp(data.index, 'font', data.value)
        }

        onColor (data: any) {
            window.console.log('onColor: ' + data)
            this.setCompProp(data.index, 'color', data.value)
        }

        setCompProp (index: number, prop: string, value: any) {
            const updated = this.components[index] as any
            updated[prop] = value
            this.$set(this.components, index, updated)
        }

        styleForComponent (comp: any, character: string) {
            return {
                fontSize: 20
            }
        }

        @Emit()
        addComponent () {
            const Comp = Vue.extend(ChatComponent)
            this.components.push(new Comp())
        }

        mounted (): void {
            fetch('https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/font/default.json').then((res) => res.json()).then((data) => {
                this.availableFonts.push('minecraft:default')
                window.console.log(data)
            })
        }
    }
</script>
