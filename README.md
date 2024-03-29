# Growtopia Player Maker

Growtopia Player Maker is helping you with making sets you only need to ids for the items, you can colorize your hair, skin, eye.

Some items would be broken need to configure it.
If im not lazy i will do it -_- | 
but u can still help me

## Example Usage

```javascript
import { readFileSync } from "fs";
import { ItemsDat } from "./Utils/ItemsDat";
import { ItemsDatMeta } from "./Utils/ItemsDat/src/Types";
import { Face, Render } from "./Render/render";

export const ItemData = {
    items: {
        meta: {} as ItemsDatMeta
    },
}

export const renderPlayer = new Render({
    skinColor: "#d54b2b",
    back: 4970,
    hair: {
        hair: 270,
        dye: { r: 166, g: 237, b: 174 }
    },
    face: {
        face: Face.DEFAULT,
        irisDye: { r: 242, g: 104, b: 235 },
        scleraDye: { r: 111, g: 95, b: 232 }
    }
}, "./Assets/sprites/" , 128); // 128 for width and height the image


(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();
    (await renderPlayer.renderPlayer()).png().toFile("render.png")
})

```

## Contributing

Still need to configure placement of items and colorizing the images.

If you help me about it i would be happy.


## Credits

- [Syn9673](https://github.com/Syn9673)
- [Growtopia](https://growtopiagame.com)