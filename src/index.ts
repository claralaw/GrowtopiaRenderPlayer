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
    back: 4970,
    shirt: 3366,
    neck: 3378,
    pant: 370,
    feet: 496,
    hat: 2470,
    hand: 1804,
    hair: {
        hair: 270,
        dye: { r: 166, g: 237, b: 174 }
    },
    skinColor: "#d54b2b",
    face: {
        face: Face.DEFAULT,
        irisDye: { r: 242, g: 104, b: 235 },
        scleraDye: { r: 111, g: 95, b: 232 }
    }
}, "./Assets/sprites/" , 128);


(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();
    
    
    (await renderPlayer.renderPlayer()).png().toFile("render.png")
})
