<template>
  <div class="chat-creator">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="component-list">
          <md-card md-with-hover>
            <md-card-header>
              <div class="md-title">Components
                <md-button class="md-primary narrow-button" @click="addComponent">+</md-button>
              </div>
            </md-card-header>

            <md-card-content>
              <div v-for="(comp, arrIndex) in components" :key="comp.index">
                <br/>
                <ChatComponent v-bind:index="comp.index" v-bind:arr-index="arrIndex" v-bind:available-fonts="availableFonts" @textChange="onText" @fontChange="onFont" @colorChange="onColor" @removeComponent="removeComponent">
                  <!--      <component :is="item" :key="index"></component>-->
                </ChatComponent>
                <br/>
                <md-divider/>
              </div>
            </md-card-content>
            <md-card-actions>
              <md-button v-on:click="addComponent()">Add Component</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>

      <br/>

      <div class="md-layout-item">
        <div class="text-view">
          <md-card md-with-hover>
            <md-card-header>
              <div class="md-title">Preview</div>
            </md-card-header>
            <md-card-content>
              <div class="text-background" v-bind:style="backgroundStyle()">
                <div class="text-renderer">
                  <template v-for="(component, compIndex) in components" v-bind:style="component.compStyle()">
                    <!-- Iterate all characters -->
                    <!-- Swap IMG with BR for line breaks -->
                    <component v-for="(t, ti) in component.text" :key="component.index + '_' + ti" v-bind:title="t" v-bind:is="isLineBreak(t) ? 'br' : 'img'" class="char-container" v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData, previewScale)">
                    </component>
                  </template>
                </div>
              </div>
              <br/>
             <div class="md-layout md-gutter">
               <div class="md-layout-item">
                 <md-field>
                   <label for="font">Background</label>
                   <md-select name="font" v-model="backgroundTexture" @md-selected="backgroundTextureChange">
                     <md-option v-for="(bg, bi) in backgroundTextureKeys" v-bind:value="bg" v-bind:key="bi">{{ bg }}</md-option>
                   </md-select>
                 </md-field>
               </div>
               <div class="md-layout-item">
                 <md-field>
                   <label for="previewScale">Preview Scale</label>
                   <md-input name="previewScale" type="number" v-model.number="previewScale"></md-input>
                 </md-field>
               </div>
             </div>
              <code>
                <pre>{{ componentJson }}</pre>
              </code>
            </md-card-content>
          </md-card>
        </div>
      </div>

    </div>


  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  /*.chat-creator {*/
  /*  height: 85vh;*/
  /*  max-height: 95vh;*/
  /*}*/

  /*.text-view {*/
  /*  overflow-y: scroll;*/
  /*  height: 30%*/
  /*}*/

  /*.component-list {*/
  /*  overflow-y: scroll;*/
  /*  height: 70%;*/
  /*}*/

  .text-background {
    image-rendering: pixelated;
    background-size: contain;
    min-height: 40px;
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
    import { MCASSET_VERSION } from '../../vars'

    import {FONTS} from "../../fonts"

    @Component({
        components: {
            ChatComponent
        }
    })
    export default class ChatCreator extends Vue {
        compCounter: number = 1
        components: ChatComponent[] = [];

        backgroundTextures: any = {
            dirt: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/dirt.png',
                color: '#a5522a'
            },
            stone: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/stone.png',
                color: '#838383'
            },
            snow: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/snow.png',
                color: '#f5f5f5'
            }
        };
        backgroundTexture: string = 'stone';

        availableFonts: string[] = [];
        fontData: any = {};

        previewScale: number =2
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

        get backgroundTextureKeys() {
            return Object.keys(this.backgroundTextures);
        }

        backgroundStyle() {
            let tex = this.backgroundTextures[this.backgroundTexture];
            return {
                backgroundImage: 'url(' + tex.image + ')',
                backgroundColor: tex.color
            }
        }

        backgroundTextureChange() {

        }

        isLineBreak(c: string) {
            return c === '\n'
        }

        onText(data: any) {
            window.console.log('onText: ' + JSON.stringify(data))
            this.setCompProp(data.index, 'text', data.value)
        }

        onFont(data: any) {
            window.console.log('onFont: ' + JSON.stringify(data))
            this.setCompProp(data.index, 'font', data.value)
        }

        onColor(data: any) {
            window.console.log('onColor: ' + JSON.stringify(data))
            this.setCompProp(data.index, 'color', data.value)
        }

        removeComponent(data: any) {
            window.console.log('removeComponent: ' + JSON.stringify(data))
            this.components.splice(data.index, 1);
            this.$forceUpdate()
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
            const comp = new ChatComponent() as any
            comp.index = this.compCounter++;
            this.components.push(comp)
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
            FONTS.forEach((font: any) => {
                fetch(font.data).then((res) => res.json()).then((data) => {
                    this.addFont(font.name, data);
                });
            })
        }
    }
</script>
