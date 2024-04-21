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
%LOCALAPPDATA%/Growtopia
```

To convert .rttex files to .png you can use 

[Cernodile's Converter](https://tools.cernodile.com/rttex.html)

[Nenkai's Converter](https://github.com/Nenkai/RTPackConverter/releases) (Recommend)

<br>

## Custom items
We are supporting custom items, you can use your own items for your character.

![img](https://github.com/FakeLeq/GrowtopiaRenderPlayer/blob/main/img/citem.png?raw=true)

How to use custom items?:

> Create citem.json, Example:
```json
{
    "items": [
        {
            "id": -1, // go minus to prevent normal items
            "name": "Purple Bubble Wings",
            "texture": "../../your_image.png", // your custom item image location
            "textureX": 0, //image x
            "textureY": 0 // image y
        }
    ]
}
```

```javascript
ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat"), readFileSync("citem.json")).decode();
                                                                               // citem.json location
```

> You can use [Tilemaker Website](https://leq-web.vercel.app) to combine your images

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

    const lens = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/GREEN/GREEN/GREEN/GREEN/BLUE/BLUE/GREEN");
    const hair = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE");

    // Dyes (RED, GREEN, BLUE, BLACK, SHAMPOO)
    // You can use dyes for hair, lens, eyedrops
    // You can use SHAMPOO as lens/eyedrop cleaner

    const renderPlayer = new Render({
        hat: 234,
        skin: {
            skinColor: { r: 65, g: 138, b: 42 }, // or Types.Skin.TONE4
        },
        hair: {
            hair: 270,
            dye: { r: hair.r, g: hair.g, b: hair.b } // or custom rgb
        },
        face: {
            expression: Types.Face.TROLL,
            eyeLens: { r: lens.r, g: lens.g, b: lens.b }, // or custom rgb
            eyeDrop: { r: 137, g: 86, b: 154 } // or colorWithDyes() function
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
