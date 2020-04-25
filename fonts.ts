const VERSION = require("./vars").MCASSET_VERSION

export const FONTS = [
  {
  name: 'minecraft:default',
  data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
  imageBase: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/textures/',
  prefix: 'minecraft:',
    // doNotCrop: true
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
    prefix: 'minecraft:',
    doNotScale: true
  },

  {
    name: 'bdcraft:128',
    data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
    imageBase: 'public/font_textures/bdcraft/',
    prefix: 'minecraft:',
    link: "https://bdcraft.net/downloads/purebdcraft-minecraft/",
    doNotCrop: true // disable automatic cropping here for now, since it cuts off too much when scaling up the default
  }
];
