const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const { Image } = require('image-js')

const { FONTS } = require('./fonts.js')

async function doStuff () {
  for (let font of FONTS) {
    let sizes = {}
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
        let img
        if (file.startsWith('http')) {
          let res = await request({
            uri: file,
            encoding: null
          })
          img = await Image.load(res)
        } else {
          if (!fs.existsSync(file)) {
            continue
          }
          img = await Image.load(file)
        }
        let secWidth = Math.round(img.width / cols)
        let secHeight = Math.round(img.height / rows)
        let imgScale = Math.round(img.width / 128) // regular font image is 128 wide
        console.log('img scale: ' + imgScale)
        let ascent = provider.ascent || 8
        let height = provider.height || 8
        console.log('sections: ' + secWidth + 'x' + secHeight)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let charCode = provider.chars[r].charCodeAt(c)
            // if(charCode!==103&&charCode!==112)continue
            let sec = img.crop({
              x: c * secWidth,
              y: r * secHeight,
              width: secWidth,
              height: secHeight
            })
            console.log('original ascent: ' + ascent)
            let scaledAscent = font.doNotScale ? ascent : (ascent * imgScale)
            console.log('scaled ascent: ' + scaledAscent)
                sec = cropAlphaRightBottom(sec, scaledAscent, 0.1, !font.doNotCrop)
            // if (ascent && !font.doNotCrop) {// this seems to specifiy the height of the character
            //   sec = sec.crop({
            //     x: 0,
            //     y: 0,
            //     width: secWidth,
            //     height: scaledAscent
            //   })
            // }
            // There's also a 'height' property, which seems to specify the section heights
            sizes[charCode] = {
              height: sec.height,
              width: sec.width
            }
            let sav = path.join(fontDir, /*path.basename(file)+*/ 'c' + charCode + '.png')
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
    fs.writeFileSync(path.join(fontDir, 'sizes.json'), JSON.stringify(sizes), 'utf8')
  }

}

// based on https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L10 - only cropping right side
function cropAlphaRightBottom (image, ascent, threshold = 0.5, doVerticalCrop = false) {
  let right = findRight(image, threshold)
  if (right === -1) {
    return image
  }
  let bottom = findBottom(image, threshold)
  if (bottom === -1) {
    return image
  }

  let y2 = bottom + 1
  let y1 = y2 - ascent

  let yh = y2 - y1

  let y = image.height - bottom + 1
  let h = Math.max(Math.min(bottom, image.height), Math.min(image.height, ascent))

  return image.crop({
    x: 0,
    y: doVerticalCrop ? Math.max(0, y1):0,
    width: Math.min(right + 1 /*+ 1*/, image.width)/* 1 to get to actual with and another 1 for padding */,
    height: doVerticalCrop  ?  yh :image.height
  })
}

// based on https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L10 - only cropping bottom side
function cropAlphaBottom (image, threshold = 0.5) {
  let bottom = findBottom(image, threshold, height)
  if (bottom === -1) {
    return image
  }
  return image.crop({
    x: 0,
    y: 0,
    width: Math.min(bottom + 1 /*+ 1*/, image.width)/* 1 to get to actual with and another 1 for padding */,
    height: image.height
  })
}

// based on https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L70
function findRight (image, threshold) {
  for (let x = image.width - 1; x >= 0; x--) {
    for (let y = 0; y < image.height; y++) {
      if (image.getValueXY(x, y, 3) >= threshold) {
        return x
      }
    }
  }
  return -1
}

// https://github.com/image-js/image-js/blob/a2deb5b4c193263d1cb784005d904ec7966f63cb/src/image/transform/cropAlpha.js#L59
function findBottom (image, threshold) {
  for (let y = image.height - 1; y >= 0; y--) {
    for (let x = 0; x < image.width; x++) {
      if (image.getValueXY(x, y, 3) >= threshold) {
        return y
      }
    }
  }
  return -1
}

doStuff()
