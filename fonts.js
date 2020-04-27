"use strict";
exports.__esModule = true;
var VERSION = require("./vars").MCASSET_VERSION;
exports.FONTS = [
    {
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
        prefix: 'minecraft:',
        doNotScale: true
    },
    {
        name: 'bdcraft:pure128',
        data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
        imageBase: 'public/font_textures/bdcraft/',
        prefix: 'minecraft:',
        link: "https://bdcraft.net/downloads/purebdcraft-minecraft/"
    },
    {
        name: 'mikeyto1o:modernhd',
        data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
        imageBase: 'public/font_textures/modern/',
        prefix: 'minecraft:',
        link: "https://www.planetminecraft.com/texture_pack/modern-hd-pack-64x-ctm-better-skies/"
    },
    {
        name: 'monsterfish_:conquest',
        data: 'https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@' + VERSION + '/assets/minecraft/font/default.json',
        imageBase: 'public/font_textures/conquest/',
        prefix: 'minecraft:',
        link: "https://www.planetminecraft.com/texture_pack/conquest-32x32/"
    }
];
