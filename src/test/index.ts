import { readFileSync, writeFileSync } from "fs";
import { DHorn, Face, Skin } from "../types/Types";
import { ItemsDat, Render } from "..";
import { colorWithDyes } from "../Utils/Recolor";
import { createWorker } from "tesseract.js";
import { Scanner } from "../Render/scan";

(async() => {


    const ItemData = await new ItemsDat(readFileSync("./Assets/items.dat")).parse();

    /*const scan = new Scanner("image.png", ItemData);
    const get = await scan.getItems();*/

    const lens = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/GREEN/GREEN/GREEN/GREEN/BLUE/BLUE/GREEN");
    const hair = await colorWithDyes("BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE/BLUE");

    // Dyes (RED, GREEN, BLUE, BLACK, SHAMPOO)
    // You can use dyes for hair, lens, eyedrops
    // You can use SHAMPOO as lens/eyedrop cleaner

    console.time("Render")
    const renderPlayer = new Render({hat: 4746, options: {d_horn: DHorn.GOAT}}, "Assets/sprites/", ItemData, 128)
       //sprites location  //item data         // width_heigh

    const output = await renderPlayer.renderPlayer() // returns buffer
    writeFileSync("player.png", output);
    console.timeEnd("Render");
})()