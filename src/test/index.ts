import { readFileSync, writeFileSync } from "fs";
import { Face, Skin } from "../Render/types/Types";
import { ItemsDatMeta } from "../Utils/ItemsDat/Types";
import { ItemsDat, Render } from "..";

const ItemData = {
    items: {
        meta: {} as ItemsDatMeta
    },
};


(async() => {
    ItemData.items.meta = await new ItemsDat(readFileSync("./Assets/items.dat")).decode();

    console.time("Render");
    const renderPlayer = new Render({
        /*back: 8024,
        hand: 1438,
        hat: 4820,
        shirt: 3370,
        neck: 3372,
        feet: 496,
        pant: 370,
        face: {
            //face: 1204,
            expression: Face.DEFAULT,
            eyeLens: { r: 0, g: 193, b: 193 },
        },*/
        hair: {
           hair: 0,
        },
        face: {
            expression: Face.DEFAULT
        },
        skin: {
            skinColor: "#d50cc4",
            opacity: 0.4,
            overlay_opac: 70
        }
    }, "./Assets/sprites/", ItemData.items.meta, 128);

    const a = (await renderPlayer.renderPlayer())
    writeFileSync("render1.png", a)

    console.timeEnd("Render")
})()