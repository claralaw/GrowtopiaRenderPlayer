import { readFileSync, writeFileSync } from "fs";
import { Face, Skin } from "../Render/types/Types";
import { ItemsDatMeta } from "../Utils/ItemsDat/Types";
import { ItemsDat, Render } from "..";
import { colorWithDyes } from "../Utils/Recolor";

const ItemData = {
    items: {
        meta: {} as ItemsDatMeta,
    },
};


(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();
    const lens = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/GREEN/GREEN/GREEN/GREEN/BLUE/BLUE/GREEN");
    const drop = await colorWithDyes("RED/RED/RED/RED/RED/RED/BLULE/BLUE/BLUE/BLUE")
    const hair = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE")

    console.time("Render");
    const renderPlayer = new Render({
        back: 8024,
        hand: 1438,
        hat: 4820,
        shirt: 3370,
        neck: 3372,
        feet: 496,
        pant: 370,
        hair: {
           hair: 270,
           dye: { r: hair.r, g: hair.g, b: hair.b }
        },
        face: {
            expression: Face.DEFAULT,
           
        },
        skin: {
            skinColor: Skin.TONE14,
        }
    }, "./Assets/sprites/", ItemData.items.meta, 128);

    const a = (await renderPlayer.renderPlayer())
    console.timeEnd("Render")
    writeFileSync("render1.png", a)
})()