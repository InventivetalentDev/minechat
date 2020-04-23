<template>
  <div class="chat-creator">
    <div>
      <div class="text-background" v-bind:style="backgroundStyle()">
        <div class="text-renderer">
          <template v-for="(component, compIndex) in components" v-bind:style="component.compStyle()">
            <!-- Iterate all characters -->
            <!-- Swap IMG with BR for line breaks -->
            <component v-for="(t, ti) in component.text" :key="compIndex + '_' + ti" v-bind:title="t" v-bind:is="isLineBreak(t) ? 'br' : 'img'" class="char-container" v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData)">
            </component>
          </template>
        </div>
      </div>
    </div>
    <div>
      <code>
        <pre>{{ componentJson }}</pre>
      </code>
    </div>


    <ChatComponent v-for="(item, index) in components" v-bind:index="index" v-bind:text="item.text" :key="index" @textChange="onText" @fontChange="onFont" @colorChange="onColor">
      <!--      <component :is="item" :key="index"></component>-->
    </ChatComponent>

    <md-button v-on:click="addComponent()">Add Component</md-button>
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

  .char-container {
    display: inline-block;
    padding: 0;
    margin: 0;
  }

  .char-container-break {
    display: block;
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
        fontData: any = {};
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

        get componentJson() {
            const base: any = {
                text: "",
                extra: []
            }
            this.components.forEach((comp: any) => {
                base.extra.push(comp.getJson())
            })
            return base
        }

        backgroundStyle() {
            return {
                backgroundImage: 'url("https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/20w17a/assets/minecraft/textures/block/' + this.backgroundTexture + '.png")'
            }
        }

        isLineBreak(c: string) {
            return c === '\n'
        }

        onText(data: any) {
            window.console.log('onText: ' + JSON.stringify(data))
            this.setCompProp(data.index, 'text', data.value)
        }

        onFont(data: any) {
            window.console.log('onFont: ' + data)
            this.setCompProp(data.index, 'font', data.value)
        }

        onColor(data: any) {
            window.console.log('onColor: ' + data)
            this.setCompProp(data.index, 'color', data.value)
        }

        setCompProp(index: number, prop: string, value: any) {
            const updated = this.components[index] as any
            updated[prop] = value
            this.$set(this.components, index, updated)
        }

        styleForComponent(comp: any, character: string) {
            return {
                fontSize: 20
            }
        }

        @Emit()
        addComponent() {
            const Comp = Vue.extend(ChatComponent)
            this.components.push(new Comp())
        }

        addFont(name: string, data: any) {
            let split = name.split(":");
            fetch("/font_data/" + split[0] + "/" + split[1] + "/sizes.json").then(res => res.json()).then(sizes => {
                data.sizes = sizes;
                this.fontData[name] = data
                this.availableFonts.push(name);
                window.console.log("Font " + name + " added")
            })
        }

        mounted(): void {
            fetch('https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/font/default.json').then((res) => res.json()).then((data) => {
                this.addFont("minecraft:default", data);
            })
            fetch('https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/font/alt.json').then((res) => res.json()).then((data) => {
                this.addFont("minecraft:alt", data);
            })
        }
    }
</script>
