const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const { Image } = require('image-js')

const VERSION = '20w17a'

const FONTS = [{
  name: 'minecraft:default',
  data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
  imageBase: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/textures/',
  prefix: 'minecraft:'
},
//   {
//   name: 'minecraft:uniform',
//   data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/uniform.json',
//   imageBase: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/textures/',
//   prefix: 'minecraft:'
// },
  {
    name: 'minecraft:alt',
    data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/alt.json',
    imageBase: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/textures/',
    prefix: 'minecraft:'
  }]

async function doStuff () {
  for (let font of FONTS) {
    let data = await request({
      uri: font.data,
      json: true
    })
    let split = font.name.split(':')
    let fontDir = path.join('public', 'font_data', split[0], split[1])
    shell.mkdir('-p', fontDir)
    let p = 0
    for (let provider of data.providers) {
      if (provider.type === 'bitmap') {
        let rows = provider.chars.length
        let cols = provider.chars[0].length
        let file = '' + font.imageBase + provider.file.substr(font.prefix.length) + ''
        console.log(file)
        // let dir = path.join(fontDir, 'p' + (p++))
        // shell.mkdir('-p', dir)
        let res = await request({
          uri: file,
          encoding: null
        })
        let img = await Image.load(res)
        let secWidth = Math.round(img.width / cols)
        let secHeight = Math.round(img.height / rows)
        console.log('sections: ' + secWidth + 'x' + secHeight)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let charCode = provider.chars[r].charCodeAt(c)
            let sec = img.crop({
              x: c * secWidth,
              y: r * secHeight,
              width: secWidth,
              height: secHeight
            });
              sec = cropAlphaRight(sec, 0.1);
            let sav = path.join(fontDir, 'c' + charCode + '.png')
            if (fs.existsSync(sav)) {
              console.warn('Duplicate image for charCode ' + charCode + ' (' + provider.chars[r][c] + ') at r' + r + ' c' + c)
            }
            await sec.save(sav, {
              format: 'png'
            })
          }
        }
      }
    }
  }

}

// based on https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L10 - only cropping right side
function cropAlphaRight (image, threshold = 0.5) {
let right = findRight(image, threshold, 4)
  if (right === -1) {
    return image;
  }
  return image.crop({
    x: 0,
    y: 0,
    width: Math.min(right+1+1, image.width)/* 1 to get to actual with and another 1 for padding */,
    height: image.height
  })
}

// based on https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L70
function findRight(image, threshold, channel) {
  for (let x = image.width - 1; x >= 0; x--) {
    for (let y = 0; y < image.height; y++) {
      if (image.getValueXY(x, y, 3) >= threshold) {
        return x;
      }
    }
  }
  return -1;
}

doStuff()
