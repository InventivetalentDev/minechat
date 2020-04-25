<template>
  <div class="chat-component">
    I{{ index }} A{{ arrIndex }}
    <md-button class="md-accent remove-component-button narrow-button" @click="removeSelf">X</md-button>
    <md-field>
      <label for="text">Text</label>
      <md-textarea name="text" type="text" v-model="text" @keyup="textChange"></md-textarea>
    </md-field>
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
    <md-field>
      <label for="font">Font</label>
      <md-select name="font" v-model="font" @md-selected="fontChange">
        <md-option v-for="(font, fi) in availableFonts" v-bind:value="font" v-bind:key="fi">{{ font }}</md-option>
      </md-select>
      <span class="md-suffix" v-if="!font.startsWith('minecraft:') && packLinks.hasOwnProperty(font)">
      <a v-bind:href="packLinks[font]" target="_blank">Resource Pack Link</a>
    </span>
    </md-field>
    <div>
      <label for="color">Color</label>
      <!--      <md-input name="color" type="text" v-model="color" @keyup="colorChange"></md-input>-->
      <Chrome v-model="color" name="color" :disable-alpha="true" @input="colorChange"></Chrome>
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
    import { MCASSET_VERSION, BASE_FONT } from '../../vars'
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
        text = 'test';
        font = 'minecraft:default';
        italic: boolean = false
        bold: boolean = false
        underlined: boolean = false
        strikethrough: boolean = false
        obfuscated: boolean = false
        color_ = '#ffffff';

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
                previewScale = 2;
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

        charContainerStyle(c: string, fontData: any, previewScale: number, hasAnyUnderlineOrStrikethrough: boolean = false ) {
            if (!previewScale) {
                previewScale = 2;
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
                marginRight: ((this.bold ? 2 : 1) * previewScale/fontSizeMultiplier) + "px"
            };
            if (width > 0) {
                style.width = width + "px";
            }

            return style;
        }

        underlineStrikethroughStyle(c: string, fontData: any, previewScale: number, isStrikethrough: boolean = false, isShadowChar: boolean = false) {
            if (!previewScale) {
                previewScale = 2;
            }
            let { width, height, fontSizeMultiplier } = this.fontMetrics(c, fontData, previewScale);

            const style: any = {
                width: (width + (previewScale * 2)) + "px",// char width + right overlap
                height: height + "px",
                marginLeft: (-previewScale), // left overlap
                marginTop: 0,
            };

            let filter = this.filter;
            if (this.shadow && isShadowChar) {
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

        charStyle(c: string, fontData: any, previewScale: number, isBoldChar: boolean = false, isShadowChar: boolean = false) {
            if (!previewScale) {
                previewScale = 2;
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
            if (this.shadow && isShadowChar) {
                style.marginLeft += previewScale/fontSizeMultiplier
                style.marginTop += previewScale

                filter += " brightness(0.35)"
            }

            let transforms = '';
            if (this.bold) {
                // Minecraft does it a bit sneaky by rendering the char twice, the second one with a +1x offset
                // So let's just do the same! :D
                if (isBoldChar) {
                    style.marginLeft += previewScale/fontSizeMultiplier
                } else {
                    style.marginRight += previewScale/fontSizeMultiplier
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
            return {
                _idx: this.index || -1,
                _aidx: this.arrIndex || -1,
                text: this.text,
                color: this.color,
                font: this.font,
                bold: this.bold,
                underlined: this.underlined,
                italic: this.italic,
                strikethrough: this.strikethrough,
                obfuscated: this.obfuscated
            }
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
