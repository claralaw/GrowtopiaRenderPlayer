import { readFileSync, writeFileSync } from "fs";
import { Face, Skin } from "../Render/types/Types";
import { ItemsDatMeta } from "../Utils/ItemsDat/Types";
import { ItemsDat, Render } from "..";
import { shadeColor } from "../Utils/Recolor";

const ItemData = {
    items: {
        meta: {} as ItemsDatMeta
    },
};


(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();

    console.time("Render");
    const renderPlayer = new Render({
        back: 6284,
        hand: 1804,
        face: {
            expression: Face.DEFAULT,
            eyeLens: { r: 0, g: 193, b: 193 },
        },
        hair: {
           hair: 270,
           dye: { r: 170, g: 0, b: 0 }
        },
        skinColor: Skin.TONE12
    }, "./Assets/sprites/", ItemData.items.meta, 128);

    const a = (await renderPlayer.renderPlayer())
    writeFileSync("render1.png", a)

    console.timeEnd("Render")
})()