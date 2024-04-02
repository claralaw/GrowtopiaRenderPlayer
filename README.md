# Growtopia Tools
With Growtopia Tools you can make custom sets

Some items are broken need to configure it.

![img](https://github.com/FakeLeq/GTools/blob/main/img/render.png?raw=true)

## Installing
```
npm i growtopia-tools
```

## Assets
For rendering your player, you need some assets (items.dat and item sprites)
[Here example assets folder](https://github.com/FakeLeq/GTools/releases/tag/Example)

You can find items.dat and item sprites in

```
%HOMEPATH%\AppData\Local\Growtopia
```

To convert .rttex files to .png you can use 

[Cernodile's Converter](https://tools.cernodile.com/rttex.html)

[Nenkai's Converter](https://github.com/Nenkai/RTPackConverter/releases) (Recommend)

<br>

## Body parts and Expressions
- [Expressions and Body parts](https://github.com/FakeLeq/GrowtopiaRenderPlayer/blob/main/src/Render/types/Types.ts)

<br>

## Example Usage

```javascript
const { writeFileSync, readFileSync } = require("fs");
const { Render, ItemsDat, Types } = require("growtopia-tools");

const ItemData = {
    items: {
        meta: {}
    },
};

(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();
                                                        // items.dat location

    const renderPlayer = new Render({
        hat: 234,
        skin: {
            skinColor: "#d50cc4", // or Types.Skin.TONE4
            opacity: 0.4, // u can use without this (for transparent skins)
            overlay_opac: 70 // u can use without this (for transparent skins)
        },
        hair: {
            hair: 270,
        },
        face: {
            expression: Types.Face.SMILE,
            eyeLens: { r: 0, g: 193, b: 193 },
            eyeDrop: { r: 0, g: 193, b: 0 },
        },
    }, "Assets/sprites/", ItemData.items.meta, 128)
       //sprites location  //item data         // width_heigh

    const output = await renderPlayer.renderPlayer() // returns buffer
    writeFileSync("player.png", output);
})()

```

## Contributing

Still need to configure placement of items and colorizing the images.

If you help me about it i would be happy.


## Credits

- [Syn9673](https://github.com/Syn9673)
- Growtopia with assets
