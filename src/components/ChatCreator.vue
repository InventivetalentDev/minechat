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
                <ChatComponent v-bind:index="comp.index" v-bind:arr-index="arrIndex" v-bind:available-fonts="availableFonts" v-bind:pack-links="packLinks"
                               @typeChange="onType" @textChange="onText" @fontChange="onFont" @colorChange="onColor"
                               @boldChange="onBold" @italicChange="onItalic" @underlineChange="onUnderlined" @strikethroughChange="onStrikethrough" @obfuscatedChange="onObfuscated"
                               @clickEventActionChange="onClickEventAction" @clickEventValueChange="onClickEventValue"
                               @removeComponent="removeComponent">
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
                <div class="md-layout-item">
                  <div class="md-layout">
                    <md-checkbox name="shadow" v-model="shadow" >Shadow</md-checkbox>
                  </div>
                </div>
              </div>

              <div class="text-background" v-bind:style="backgroundStyle()">
                <div class="text-renderer">
                  <template v-for="(component, compIndex) in components" v-bind:style="component.compStyle()">
                    <!-- Iterate all characters -->
                    <!-- Swap IMG with BR for line breaks -->
                    <component v-for="(t, ti) in component.text" :key="component.index + '_' + ti" v-bind:title="t" v-bind:is="isLineBreak(t) ? 'br' : 'div'" class="char-container" v-bind:style="component.charContainerStyle(t, fontData, previewScale, hasUnderlineOrStrikethrough(), shadow)" :data-char-code="t.charCodeAt(0)">
                      <!-- Stuff rendered in background -->
                      <!---- Shadows ---->
                      <img v-if="!isLineBreak(t) && shadow"  v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData, previewScale, false, true, shadow)" class="shadow-char"/>
                      <img v-if="!isLineBreak(t) && shadow && component.bold"  v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData, previewScale, true, true, shadow)" class="shadow-char"/>
                      <img v-if="!isLineBreak(t) && shadow && component.strikethrough" src="font_data/strikethrough.png" v-bind:style="component.underlineStrikethroughStyle(t, fontData, previewScale, true, true, shadow)"  class="shadow-char strikethrough-overlay"/>
                      <img v-if="!isLineBreak(t) && shadow && component.underlined" src="font_data/underline.png" v-bind:style="component.underlineStrikethroughStyle(t, fontData, previewScale, false, true, shadow)"  class="shadow-char underline-overlay"/>
                      <!---- Boldness ---->
                      <img v-if="!isLineBreak(t) && component.bold"  v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData, previewScale, true, false, shadow)" class="bold-char"/>

                      <!-- Actual character -->
                      <img v-if="!isLineBreak(t)" v-bind:src="component.charSrc(t)" v-bind:style="component.charStyle(t, fontData, previewScale, false, false, shadow)" class="base-char"/>

                      <!-- Foreground elements -->
                      <img v-if="!isLineBreak(t) && component.strikethrough" src="font_data/strikethrough.png" v-bind:style="component.underlineStrikethroughStyle(t, fontData, previewScale, true, false, shadow)"  class="strikethrough-overlay"/>
                      <img v-if="!isLineBreak(t) && component.underlined" src="font_data/underline.png" v-bind:style="component.underlineStrikethroughStyle(t, fontData, previewScale, false, false, shadow)"  class="underline-overlay"/>
                    </component>
                  </template>
                </div>
              </div>

              <br/>

             <div>
               <md-field>
                 <label>Java /tellraw command <template v-if="javaComponentJson.length>=256">REQUIRES COMMAND BLOCK</template></label>
                 <md-input type="text" :value="'tellraw @p ' + javaComponentJson" readonly></md-input>
               </md-field>
             </div>
            </md-card-content>
          </md-card>
        </div>

        <br/>

        <div class="about">
          <md-card md-with-hover>
            <md-card-header>
              <div class="md-title">About</div>
            </md-card-header>
            <md-card-content>
              <div>
                This is a tool to generate Minecraft chat components, primarily for the new color & font options introduced in the <a href="https://www.minecraft.net/de-de/article/minecraft-snapshot-20w17a" target="_blank">20w17a snapshot</a>.<br/>
                It's still a work-in-progress, so please bear with me while I'm changing stuff :) <br/>
                <br/>
                Made by <a href="https://inventivetalent.org" target="_blank">inventivetalent</a>
              </div>
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
    padding: 20px;
  }

  .char-container {
    display: inline-block;
    padding: 0;
    margin: 0;
  }

  .base-char{
    position:absolute;
  }
  .bold-char{
    position:absolute;
  }
  .shadow-char{
    position: absolute;
  }
  .strikethrough-overlay{
    position: absolute;
  }
  .underline-overlay{
    position:absolute;
  }

  .char-container-break {
    display: block;
  }
</style>

<script lang="ts">
    import { Component, Emit, Prop, PropSync, Provide, Vue, Watch } from 'vue-property-decorator'
    import ChatComponent from '@/components/ChatComponent.vue'
    import { DEFAULT_PREVIEW_SCALE, MCASSET_VERSION } from '../../vars'

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
            grass: {
                image: 'https://i.imgur.com/AQeXKzD.png',
                color: '#1bba12'
            },
            stone: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/stone.png',
                color: '#838383'
            },
            snow: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/snow.png',
                color: '#f5f5f5'
            },
            obsidian: {
                image: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + MCASSET_VERSION + '/assets/minecraft/textures/block/obsidian.png',
                color: '#222222'
            }
        };
        backgroundTexture: string = 'stone';

        availableFonts: string[] = [];
        fontData: any = {};

        packLinks: any = {};

        previewScale: number = DEFAULT_PREVIEW_SCALE;
        shadow: boolean = true;
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

        get javaComponentJson() {
            const base: any = {
                text: "",
                extra: []
            }
            this.components.forEach((comp: any) => {
                base.extra.push(comp.getJson())
            })
            return JSON.stringify(base);
        }

        get backgroundTextureKeys() {
            return Object.keys(this.backgroundTextures);
        }

        hasUnderlineOrStrikethrough(): boolean {
            for (let comp of this.components) {
                let a = comp as any;
                if(a.underlined||a.strikethrough)return true;
            }
            return false;
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

        onBold(data: any) {
            this.setCompProp(data.index, 'bold', data.value)
        }

        onItalic(data: any) {
            this.setCompProp(data.index, 'italic', data.value)
        }

        onUnderlined(data: any) {
            this.setCompProp(data.index, 'underlined', data.value)
        }

        onStrikethrough(data: any) {
            this.setCompProp(data.index, 'strikethrough', data.value)
        }

        onObfuscated(data: any) {
            this.setCompProp(data.index, 'obfuscated', data.value)
        }

        onType(data: any) {
            this.setCompProp(data.index, 'type', data.value)
        }

        onClickEventAction(data: any) {
            this.setCompProp(data.index, 'clickEventAction', data.value)
        }

        onClickEventValue(data: any) {
            this.setCompProp(data.index, 'clickEventValue', data.value)
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
            window.console.log(FONTS)
            FONTS.forEach((font: any) => {
                fetch(font.data).then((res) => res.json()).then((data) => {
                    this.addFont(font.name, data);
                    if (font.link) {
                        this.packLinks[font.name] = font.link;
                    }
                });
            })
        }
    }
</script>
