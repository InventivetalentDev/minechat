<template>
  <div class="chat-component">
    <md-field>
      <label for="text">Text</label>
      <md-input name="text" type="text" v-model="text" @keyup="textChange"></md-input>
    </md-field>
    <md-field>
      <label for="font">Font</label>
      <md-select name="font" v-model="font" @md-selected="fontChange">
        <md-option v-for="(font, fi) in $parent.availableFonts" v-bind:value="font" v-bind:key="fi">{{ font }}</md-option>
      </md-select>
    </md-field>
    <div>
      <label for="color">Color</label>
<!--      <md-input name="color" type="text" v-model="color" @keyup="colorChange"></md-input>-->
      <Chrome v-model="color" name="color" @input="colorChange"></Chrome>
    </div>
  </div>
</template>

<script lang="ts">
    import { Component, Emit, Model, Prop, PropSync, Provide, Vue } from 'vue-property-decorator'
    import { MCASSET_VERSION } from '@/vars'
    import Material from 'vue-color/src/components/Material.vue'
    import Chrome from 'vue-color/src/components/Chrome.vue'

    import { Color, hexToRgb, Solver } from '@/colorizer'

    @Component({
        components: {
            Chrome
        }
    })
    export default class ChatComponent extends Vue {
       @Prop(Number) index!: number;
        text = 'test';
        font = 'default';
         color_ = '#ffffff';

         filter = 'saturate(1)'


        get color () {
             return this.color_
        }

        set color (v: any) {
             if (typeof v === "string") {
                 this.color_ = v
             } else { // vue-color returns object
                 this.color_ = v.hex
             }
            this.filter = this.filterColor()
        }

         filterColor () {
             window.console.log(this.color_)
             const rgb = hexToRgb(this.color_)
             window.console.log(rgb)
             if(rgb != null) {
                 const color = new Color(rgb[0], rgb[1], rgb[2])
                 const solver = new Solver(color)
                 const result = solver.solve()
                 return result.filter
             }
             return ''
         }

         compStyle () {
             return {
                 // color: this.color,
                 // backgroundColor: this.color,
                 // background: 'linear-gradient(' + this.color + ', ' + this.color + '), #00F',
                 'filter': this.filter,
                 backgroundBlendMode: 'multiply',
                 backgroundRepeat: 'no-repeat'
             }
         }

         charSrc (c: string) {
             return '/font_data/minecraft/default/c' + c.charCodeAt(0) + '.png'
         }

        charStyle (c: string) {
             const size = '16px'
            /// COLORS https://codepen.io/sosuke/pen/Pjoqqp
            //  https://stackoverflow.com/questions/42966641/how-to-transform-black-into-any-given-color-using-only-css-filters/43960991#43960991
            return {
                // background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/font_data/minecraft/default/c' + c.charCodeAt(0) + '.png")',
                // backgroundPosition: '0px 0px',
                // backgroundSize: size + ' ' + size,
                width: size,
                height: size,
                display: 'inline-block'
            }
        }

        textChange () {
             window.console.log('textChange')
             this.$emit('textChange', { index: this.index, value: this.text })
         }

        fontChange () {
            window.console.log('fontChange')
            this.$emit('fontChange', { index: this.index, value: this.font })
        }

        colorChange () {
            window.console.log('colorChange')
            this.filter = this.filterColor()
            this.$emit('colorChange', { index: this.index, value: this.color })
        }

        mounted(): void {
             // trigger initial values
             this.textChange()
            this.fontChange()
            this.colorChange()
        }
    }
</script>
