<template>
  <div class="chat-component">
    I{{ index }} A{{ arrIndex }}
    <md-button class="md-accent remove-component-button narrow-button" @click="removeSelf">X</md-button>
    <div>
      <md-field>
        <label for="text">Text</label>
        <md-textarea name="text" type="text" v-model="text" @keyup="textChange"></md-textarea>
      </md-field>
    </div>
   <div>
     <md-field>
       <label for="Type"></label>
       <md-select name="type" v-model="type" @md-selected="typeChange">
         <md-option value="text">Plain Text</md-option>
         <md-option value="translate">Translated Text</md-option>
         <md-option value="score" disabled>Scoreboard Value</md-option>
         <md-option value="selector">Entity Names</md-option>
         <md-option value="keybind">Keybind</md-option>
         <md-option value="nbt" disabled>NBT Value</md-option>
       </md-select>
     </md-field>
   </div>
    <div class="md-layout">
      <div class="md-layout">
        <md-checkbox name="bold" v-model="bold" @change="boldChange">Bold</md-checkbox>
      </div>
      <div class="md-layout">
        <md-checkbox name="italic" v-model="italic" @change="italicChange">Italic</md-checkbox>
      </div>
      <div class="md-layout">
        <md-checkbox name="underlined" v-model="underlined" @change="underlineChange">Underlined</md-checkbox>
      </div>
      <div class="md-layout">
        <md-checkbox name="strikethrough" v-model="strikethrough" @change="strikethroughChange">Strikethrough</md-checkbox>
      </div>
      <div class="md-layout">
        <md-checkbox name="obfuscated" v-model="obfuscated" @change="obfuscatedChange" disabled="">Obfuscated</md-checkbox>
      </div>
    </div>
   <div>
     <md-field>
       <label for="font">Font</label>
       <md-select name="font" v-model="font" @md-selected="fontChange">
         <md-option v-for="(font, fi) in availableFonts" v-bind:value="font" v-bind:key="fi">{{ font }}</md-option>
       </md-select>
       <span class="md-suffix" v-if="!font.startsWith('minecraft:') && packLinks.hasOwnProperty(font)">
      <a v-bind:href="packLinks[font]" target="_blank">Resource Pack Link</a>
    </span>
     </md-field>
   </div>
    <div class="md-layout">
      <div class="md-layout-item">
        <label for="color">Color</label>
        <!--      <md-input name="color" type="text" v-model="color" @keyup="colorChange"></md-input>-->
        <Chrome v-model="color" name="color" :disable-alpha="true" @input="colorChange"></Chrome>
      </div>
      <div class="md-layout-item">
        <md-button @click="setColor('#000000')" style="background-color: #000000; color: white;">(§0) Black</md-button>
        <md-button @click="setColor('#0000AA')" style="background-color: #0000AA; color: white;">(§1) Dark Blue</md-button>
        <md-button @click="setColor('#00AA00')" style="background-color: #00AA00; ">(§2) Dark Green</md-button>
        <md-button @click="setColor('#00AAAA')" style="background-color: #00AAAA; ">(§3) Dark Aqua</md-button>
        <md-button @click="setColor('#AA0000')" style="background-color: #AA0000; ">(§4) Dark Red</md-button>
        <md-button @click="setColor('#AA00AA')" style="background-color: #AA00AA; ">(§5) Dark Purple</md-button>
        <md-button @click="setColor('#FFAA00')" style="background-color: #FFAA00; ">(§6) Gold</md-button>
        <md-button @click="setColor('#AAAAAA')" style="background-color: #AAAAAA; ">(§7) Gray</md-button>
        <md-button @click="setColor('#555555')" style="background-color: #555555; ">(§8) Dark Gray</md-button>
        <md-button @click="setColor('#5555FF')" style="background-color: #5555FF; ">(§9) Blue</md-button>
        <md-button @click="setColor('#55FF55')" style="background-color: #55FF55; ">(§a) Green</md-button>
        <md-button @click="setColor('#55FFFF')" style="background-color: #55FFFF; ">(§b) Aqua</md-button>
        <md-button @click="setColor('#FF5555')" style="background-color: #FF5555; ">(§c) Red</md-button>
        <md-button @click="setColor('#FF55FF')" style="background-color: #FF55FF; ">(§d) Light Purple</md-button>
        <md-button @click="setColor('#FFFF55')" style="background-color: #FFFF55; ">(§e) Yellow</md-button>
        <md-button @click="setColor('#FFFFFF')" style="background-color: #FFFFFF; ">(§f) White</md-button>
      </div>
    </div>
    <br/>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="clickEventAction">Action</label>
          <md-select id="clickEventAction" v-model="clickEventAction" @md-selected="clickEventActionChange">
            <md-option value="none">None</md-option>
            <md-option value="open_url">Open URL</md-option>
            <md-option value="open_file">Open File</md-option>
            <md-option value="run_command">Run Command</md-option>
            <md-option value="suggest_command">Suggest Command</md-option>
            <md-option value="change_page">Change Page (Book Only)</md-option>
            <md-option value="copy_to_clipboard">Copy To Clipboard</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label for="clickEventValue">Value</label>
          <md-input id="clickEventValue" type="text" v-model="clickEventValue" :disabled="clickEventAction==='none'" @keyup="clickEventValueChange"></md-input>
        </md-field>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .remove-component-button {
    float: right;
  }
</style>

<script lang="ts">
    import { Component, Emit, Inject, Model, Prop, PropSync, Provide, Vue } from 'vue-property-decorator'
    import { MCASSET_VERSION, BASE_FONT, DEFAULT_PREVIEW_SCALE } from '../../vars'
    import Material from 'vue-color/src/components/Material.vue'
    import Chrome from 'vue-color/src/components/Chrome.vue'

    import { Color, hexToRgb, Solver } from '@/colorizer'

    const scale = 2;

    @Component({
        components: {
            Chrome
        }
    })
    export default class ChatComponent extends Vue {
        @Prop(Number) arrIndex!: number;
        @Prop(Number) index!: number;
        @Prop(Array) availableFonts!: string[];
        @Prop(Object) packLinks!: any;
        type = 'text';
        text = 'test';
        font = 'minecraft:default';
        italic: boolean = false
        bold: boolean = false
        underlined: boolean = false
        strikethrough: boolean = false
        obfuscated: boolean = false
        color_ = '#ffffff';

        clickEventAction = 'none';
        clickEventValue = '';

        shadow: boolean = true

        filter = 'saturate(1)'


        get color() {
            return this.color_
        }

        set color(v: any) {
            if (typeof v === "string") {
                this.color_ = v
            } else { // vue-color returns object
                this.color_ = v.hex
            }
            this.filter = this.filterColor()
        }

        setColor(v: string) {
            this.color = v;
            this.colorChange();
        }

        filterColor() {
            window.console.log(this.color_)
            const rgb = hexToRgb(this.color_)
            window.console.log(rgb)
            if (rgb != null) {
                const color = new Color(rgb[0], rgb[1], rgb[2])
                const solver = new Solver(color)
                const result = solver.solve()
                return result.filter
            }
            return ''
        }

        compStyle() {
            return {
                'filter': this.filter,
                backgroundBlendMode: 'multiply',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block'
            }
        }

        fontNamespace() {
            return this.font.split(":")[0]
        }

        fontName() {
            return this.font.split(":")[1]
        }

        charSrc(c: string) {
            return '/font_data/' + this.fontNamespace() + '/' + this.fontName() + '/c' + c.charCodeAt(0) + '.png'
        }

        fontMetrics(c: string, fontData: any, previewScale: number) {
            if (!previewScale) {
                previewScale = DEFAULT_PREVIEW_SCALE;
            }
            const charCode = c.charCodeAt(0);
            const baseSize = fontData[BASE_FONT].sizes["" + charCode];
            const size = fontData[this.font].sizes["" + charCode];
            const fontSizeMultiplier = (size ? size.height : 8) / (baseSize ? baseSize.height : 8);
            let height = (size ? size.height : 8) / fontSizeMultiplier * previewScale;
            const width = (size ? size.width : 0) / fontSizeMultiplier * previewScale;

            return {
                width,
                height,
                fontSizeMultiplier
            }
        }

        charContainerStyle(c: string, fontData: any, previewScale: number, hasAnyUnderlineOrStrikethrough: boolean = false, shadow: boolean = true) {
            if (!previewScale) {
                previewScale = DEFAULT_PREVIEW_SCALE;
            }
            let { width, height, fontSizeMultiplier } = this.fontMetrics(c, fontData, previewScale);

            if (this.shadow) {
                height += previewScale;
            }
            if (hasAnyUnderlineOrStrikethrough) {
                height += (previewScale * 2);
            }

            const style: any = {
                // filter: this.filter,
                height: height + "px",
                marginRight: ((this.bold ? 2 : 1) * previewScale / fontSizeMultiplier) + "px"
            };
            if (width > 0) {
                style.width = width + "px";
            }

            return style;
        }

        underlineStrikethroughStyle(c: string, fontData: any, previewScale: number, isStrikethrough: boolean = false, isShadowChar: boolean = false, shadow: boolean = true) {
            if (!previewScale) {
                previewScale = DEFAULT_PREVIEW_SCALE;
            }
            let { width, height, fontSizeMultiplier } = this.fontMetrics(c, fontData, previewScale);

            const style: any = {
                width: (width + (previewScale * 2)) + "px",// char width + right overlap
                height: height + "px",
                marginLeft: (-previewScale), // left overlap
                marginTop: 0,
            };

            let filter = this.filter;
            if (shadow && isShadowChar) {
                style.marginLeft += previewScale
                style.marginTop += previewScale

                filter += " brightness(0.35)"
            }

            if (this.underlined && !isStrikethrough) {
                style.marginTop += (2 * previewScale)
            }
            if (this.strikethrough && isStrikethrough) {
                style.marginTop += previewScale
            }

            style.filter = filter;

            style.marginRight += "px";
            style.marginLeft += "px"
            style.marginTop += "px";

            return style;
        }

        charStyle(c: string, fontData: any, previewScale: number, isBoldChar: boolean = false, isShadowChar: boolean = false, shadow: boolean = true) {
            if (!previewScale) {
                previewScale = DEFAULT_PREVIEW_SCALE;
            }
            let { width, height, fontSizeMultiplier } = this.fontMetrics(c, fontData, previewScale);

            const style: any = {
                // Component stuff
                // 'filter': this.filter,
                // Char stuff
                height: height + "px",
                marginLeft: 0,
                marginTop: 0,
                marginRight: 0
            };

            if (width > 0) {
                style.width = width + "px";
            }

            let filter = this.filter;
            if (shadow && isShadowChar) {
                style.marginLeft += previewScale / fontSizeMultiplier
                style.marginTop += previewScale

                filter += " brightness(0.35)"
            }

            let transforms = '';
            if (this.bold) {
                // Minecraft does it a bit sneaky by rendering the char twice, the second one with a +1x offset
                // So let's just do the same! :D
                if (isBoldChar) {
                    style.marginLeft += previewScale / fontSizeMultiplier
                } else {
                    style.marginRight += previewScale / fontSizeMultiplier
                }
            }
            if (this.italic) {
                transforms += "skew(-10deg) ";
            }
            // if (this.underlined && c === "underline") {
            //     style.marginTop += previewScale;
            // }
            // if (this.strikethrough && c === "strikethrough") {
            //     style.marginTop += previewScale;
            // }
            style.transform = transforms;

            style.filter = filter;

            style.marginRight += "px";
            style.marginLeft += "px"
            style.marginTop += "px";

            return style;
        }


        getJson(): any {
            let json: any = {
                _idx: this.index || -1,
                _aidx: this.arrIndex || -1,
                _type: this.type,
                color: this.color,
                font: this.font,
                bold: this.bold,
                underlined: this.underlined,
                italic: this.italic,
                strikethrough: this.strikethrough,
                obfuscated: this.obfuscated
            };

            switch (this.type) {
                case 'text':
                    json.text = this.text;
                    break;
                case 'translate':
                    json.translate = this.text;
                    //TODO: with
                    break;
                case 'score':
                    //TODO
                    break;
                case 'selector':
                    json.selector = this.text;
                    break;
                case 'keybind':
                    json.keybind = this.text;
                    break;
                case 'nbt':
                    //TODO
                    break;
            }

            if (this.clickEventAction !== "none") {
                json.clickEvent = {
                    action: this.clickEventAction,
                    value: this.clickEventValue
                }
            }

            return json;
        }

        textChange() {
            window.console.log('textChange')
            this.$emit('textChange', { index: this.arrIndex, value: this.text })
        }

        fontChange() {
            window.console.log('fontChange')
            this.$emit('fontChange', { index: this.arrIndex, value: this.font })
        }

        colorChange() {
            window.console.log('colorChange')
            this.filter = this.filterColor()
            this.$emit('colorChange', { index: this.arrIndex, value: this.color })
        }

        boldChange() {
            this.$emit('boldChange', { index: this.arrIndex, value: this.bold })
        }

        italicChange() {
            this.$emit('italicChange', { index: this.arrIndex, value: this.italic })
        }

        underlineChange() {
            this.$emit('underlineChange', { index: this.arrIndex, value: this.underlined })
        }

        strikethroughChange() {
            this.$emit('strikethroughChange', { index: this.arrIndex, value: this.strikethrough })
        }

        obfuscatedChange() {
            this.$emit('obfuscatedChange', { index: this.arrIndex, value: this.obfuscated })
        }

        typeChange() {
            this.$emit('typeChange', { index: this.arrIndex, value: this.type })
        }

        clickEventActionChange() {
            this.$emit('clickEventActionChange', { index: this.arrIndex, value: this.clickEventAction })
        }

        clickEventValueChange() {
            this.$emit('clickEventValueChange', { index: this.arrIndex, value: this.clickEventValue })
        }

        removeSelf() {
            this.$emit('removeComponent', { index: this.arrIndex })
        }

        mounted(): void {
            // trigger initial values
            this.textChange()
            this.fontChange()
            this.colorChange()
        }
    }
</script>
