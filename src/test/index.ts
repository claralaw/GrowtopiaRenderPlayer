import { readFileSync } from "fs";
import { Face, Skin } from "../Render/types/Types";
import { ItemsDat } from "../Utils/ItemsDat";
import { ItemsDatMeta } from "../Utils/ItemsDat/src/Types";
import { Render } from "..";

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
           dye: { r: 255, g: 0, b: 0 }
        },
        hat: 9416,
        skinColor: Skin.TONE12 // or you can use hex colors "#da78e3"
    }, "./Assets/sprites/", ItemData.items.meta, 128);

    (await renderPlayer.renderPlayer()).png().toFile("render.png")
    console.timeEnd("Render")
})()