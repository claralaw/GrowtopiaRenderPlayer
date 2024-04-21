// you said no no no, i said no no no
// you said take me home i said dom perignon
// you said no no no, i said no no no, no no no no
// hasta la vida loca loca loca loca
// te encanta la musica te toca toca toca

import sharp from "sharp";
import { Color } from "../Render/types/Types";

export function shadeColor(color: Color, amount: number) { // negative darker, positive lighter
    let r = Math.max(Math.min(255, color.r + amount), 0),
    g = Math.max(Math.min(255, color.g + amount), 0),
    b = Math.max(Math.min(255, color.b + amount), 0)
  
    return {r: r, g: g, b: b}
}

export async function colorWithDyes(dyeStr: string) {
    const dyes = dyeStr.split("/").map((x: string) => { return x.toUpperCase() })

    let r = 255, g = 255, b = 255;

    for(let i = 0; i < dyes.length; i++) {
        switch(dyes[i]) {
            case "BLACK": {
                if(r != 0) r -= 17; if(g != 0) g -= 17; if(b != 0) b -= 17;
            } break;
            case "RED": {
                if(r != 255) r += 17; if(g != 0) g -= 17; if(b != 0) b -= 17;
            } break;
            case "GREEN": {
                if(r != 0) r -= 17; if(g != 255) g += 17; if(b != 0) b -= 17;
            } break;
            case "BLUE": {
                if(r != 0) r -= 17; if(g != 0) g -= 17; if(b != 255) b += 17;
            } break;
            case "SHAMPOO": {
                if(r != 255) r += 17; if(g != 255) g += 17; if(b != 255) b += 17;
            } break;
           
        }
         console.log(r, g, b)
    }

    return{r: r, g: g, b: b};
}

export async function tint(image: Buffer | string, color: Color): Promise<Buffer> {
    let r = color.r / 255, g = color.g / 255, b = color.b / 255;

    const buf = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true }).then(async ({ data, info }) => {
        for(let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3] / 255;
            data[i] *= r * alpha;
            data[i + 1] *= g * alpha;
            data[i + 2] *= b * alpha;
        }

        return await sharp(data, {raw: { width: info.width, height: info.height, channels: 4 }}).png().toBuffer(); //TODO
    })

    return buf;
}