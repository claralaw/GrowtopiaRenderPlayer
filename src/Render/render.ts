import sharp from "sharp";
import { ChangeColorGetBuffer, shadeColor } from "../Utils/Recolor";
import { ItemData } from "..";

export enum Face {
    DEFAULT, SMILE
}

interface DyeTypes {
    r: number;
    g: number;
    b: number
}

interface CompositeInfo {
    buffer: Buffer;
    x: number;
    y: number;
    tile: number;
}

interface BodyParts {
    skinColor: string;
    feet: number;
    shirt: number;
    hand: number;
    neck: number;
    pant: number;
    hat: number;
    back: number;
    hair?: {
        hair: number;
        dye: DyeTypes;
    }
    face: {
        face: Face,
        irisDye?: DyeTypes;
        scleraDye?: DyeTypes;
    }
}

export class Render {
    
    constructor(private parts: Partial<BodyParts>, private spriteLocation: string, private w_h: number) {
        if(!this.parts.feet) this.parts.feet = 0;
        if(!this.parts.hand) this.parts.hand = 0;
        if(!this.parts.neck) this.parts.neck = 0;
        if(!this.parts.pant) this.parts.pant = 0;
        if(!this.parts.back) this.parts.back = 0;
        if(!this.parts.hat) this.parts.hat = 0;
        if(!this.parts.back) this.parts.back = 0;
        if(!this.parts.shirt) this.parts.shirt = 0;

        if(!this.parts.face?.irisDye) this.parts.face!.irisDye = { r: 0, g: 0, b: 0 }
        if(!this.parts.hair) {
            this.parts.hair = {
                hair: 0,
                dye: { r: 0, g: 0, b: 0 }
            }
        }

        if(!this.parts.skinColor) this.parts.skinColor = "#b38977"
    }

    public async getItemInfo(ItemID: number) {
        return ItemData.items.meta.items[ItemID];
    }

    private async renderHat(): Promise<CompositeInfo> {
        let i_hat = await this.getItemInfo(this.parts.hat!); 

        return {
            buffer: await sharp(this.spriteLocation + `${i_hat.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_hat.textureX! * 32, top: i_hat.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 - 64,
            y: this.w_h * 0.5 - 32,
            tile: 5,
        }
    }

    private async renderHair(): Promise<CompositeInfo> {
        let hair = await this.getItemInfo(this.parts.hair!.hair);
    
        let hexColor = (1 << 24 | this.parts.hair!.dye.r << 16 | this.parts.hair!.dye.g << 8 | this.parts.hair!.dye.b).toString(16).slice(1);
        let render = await sharp(this.spriteLocation + `${hair.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: hair.textureX! * 32, top: hair.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer()

        return {
            buffer: hexColor == "000000" ? render : await ChangeColorGetBuffer(render, shadeColor(hexColor, 0)),
            x: this.w_h * 0.5 - 64,
            y: this.w_h * 0.5 - 32,
            tile: 3
        }
    }

    private async renderNeck(): Promise<CompositeInfo> {
        let i_neck = await this.getItemInfo(this.parts.neck!);
        let neck = await sharp(this.spriteLocation + `${i_neck.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_neck.textureX! * 32, top: i_neck.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer();

        switch (i_neck.id) {
            /* Silk Tie */
            case 3372: neck = await ChangeColorGetBuffer(neck, "#C80000", 80); break; //red tie
            case 3374: neck = await ChangeColorGetBuffer(neck, "#FFFF00", 80); break; //yellow tie
            case 3376: neck = await ChangeColorGetBuffer(neck, "#282828", 80); break; //black tie
            case 3378: neck = await ChangeColorGetBuffer(neck, "#0000bc", 80); break; //blue tie
            case 3380: neck = await ChangeColorGetBuffer(neck, "#828282", 80); break; // grey tie;
            /* */
            default: neck;
                break;
        }

        return {
            buffer: neck,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 4,
        }
    }

    private async renderPant(): Promise<CompositeInfo> {
        let pant = await this.getItemInfo(this.parts.pant!)

        return {
            buffer: await sharp(this.spriteLocation + `${pant.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: pant.textureX! * 32, top: pant.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 2,
        }
    }

    private async renderHand(): Promise<CompositeInfo> {
        let hand = await this.getItemInfo(this.parts.hand!)

        return {
            buffer: await sharp(this.spriteLocation + `${hand.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: hand.textureX! * 32, top: hand.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 + 4,
            y: this.w_h * 0.5 - 46,
            tile: 5,
        }
    }

    private async renderShirt(): Promise<CompositeInfo> {
        let i_shirt = await this.getItemInfo(this.parts.shirt!);
        let shirt = await sharp(this.spriteLocation + `${i_shirt.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_shirt.textureX! * 32, top: i_shirt.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        switch(i_shirt.id) {
             /* Silk Vest */
             case 3360: shirt = await ChangeColorGetBuffer(shirt, "#FF3232", 80); break; //red vest
             case 3362: shirt = await ChangeColorGetBuffer(shirt, "#32FF32", 80); break; //green vest
             case 3364: shirt = await ChangeColorGetBuffer(shirt, "#0032FF", 80); break; //blue vest
             case 3366: shirt = await ChangeColorGetBuffer(shirt, "#FF00FF", 80); break; //purple vest
             case 3368: shirt = await ChangeColorGetBuffer(shirt, "#C8C8C8", 80); break; // grey vest
             case 3370: shirt = await ChangeColorGetBuffer(shirt, "#373737", 80); break; //black vest
             /* */
            default: shirt; break;
        }

        return { 
            buffer: shirt,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1,
        }
    }

    private async renderBack(): Promise<CompositeInfo> {
        let i_back = await this.getItemInfo(this.parts.back!)
        let x, y;
        let back = await sharp(this.spriteLocation + `${i_back.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_back.textureX! * 32, top: i_back.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        switch(i_back.id) {
            case 4970: case 4972: case 6284: case 8084: case 8024: case 8026:
            case 3114: back = await sharp(this.spriteLocation + `${i_back.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_back.textureX! * 32, top: i_back.textureY! * 32 }).resize(96,96, {kernel: sharp.kernel.nearest}).toBuffer(); break;

            default: back;
        }

        return {
            buffer: back,
            x: this.w_h * 0.5 - 60,
            y: this.w_h * 0.5 - 48,
            tile: -3,
        }
    }

    private async renderVest(): Promise<CompositeInfo> {
        let data = await this.getItemInfo(this.parts.shirt!);
        let vest = await sharp(this.spriteLocation + `${data.texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: (data.textureX! + 1) * 32, top: data.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        return {
            buffer: vest,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1
        }
    }

    private async renderFace(): Promise<CompositeInfo> { // face still broken lol
        let x = 0, y = 0;
        let irisColor = (1 << 24 | this.parts.face?.irisDye?.r! << 16 | this.parts.face?.irisDye?.g! << 8 | this.parts.face?.irisDye?.b!).toString(16).slice(1);
        let scleraColor = (1 << 24 | this.parts.face?.scleraDye?.r! << 16 | this.parts.face?.scleraDye?.g! << 8 | this.parts.face?.scleraDye?.b!).toString(16).slice(1);
        
        switch(this.parts.face?.face) {
            case Face.DEFAULT: x = 0, y = 0; break;
            case Face.SMILE: x = 0, y = 1; break;
        }

        let f_back = await sharp(this.spriteLocation + `player_eyes.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let iris = await sharp(this.spriteLocation + `player_eyes2.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let mouth = await sharp(this.spriteLocation + `player_face.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let eyelid = await sharp(this.spriteLocation + `player_eyes.png`).extract({ width: 32, height: 32, left: 0 * 32, top: 4 * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        let end = await sharp({create: { width: this.w_h, height: this.w_h, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0} }})
        .composite([
            {input: await ChangeColorGetBuffer(f_back, scleraColor, 80), top: 0, left: 0},
            {input: await ChangeColorGetBuffer(eyelid, shadeColor(`${this.parts.skinColor}`, 2)), top: 0, left: 0},
            {input: await ChangeColorGetBuffer(mouth, shadeColor(`${this.parts.skinColor}`, -80)), top: 0, left: 0},
            {input: await ChangeColorGetBuffer(iris, irisColor, 80), top: 0, left: 0},
        ]).png().toBuffer();

        
        return {
            buffer: end,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1,
        }
    }

    public async getRenders() {
        const arr: CompositeInfo[] = [];
        const i_feet = await this.getItemInfo(this.parts.feet!);

        // read
        const extraLeg = await sharp(this.spriteLocation + "extraleg.png").resize(32,32, {kernel: sharp.kernel.nearest}).toBuffer()
        const arm = await sharp(this.spriteLocation + "arm.png").resize(16,32, {kernel: sharp.kernel.nearest}).toBuffer()
        const r_body = await sharp(this.spriteLocation + "body.png").resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer()
        const r_feet = await sharp(this.spriteLocation + `${(this.parts.feet) != 0 ? i_feet.texture?.replace(".rttex", ".png") : "player_feet.png"}`).extract({ width: 32, height: 32, left: (this.parts.feet != 0 ? i_feet!.textureX! : 0) * 32, top: ((((this.parts.feet != 0 ? i_feet!.textureY! : 0)) * 2) * 32) + 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer() 
        const l_feet = await sharp(this.spriteLocation + `${(this.parts.feet) != 0 ? i_feet.texture?.replace(".rttex", ".png") : "player_feet.png"}`).extract({ width: 32, height: 32, left: (this.parts.feet != 0 ? i_feet!.textureX! : 0) * 32, top: (((this.parts.feet != 0 ? i_feet!.textureY! : 0)) * 2) * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer() 
        // read end

        // array body
        const extra: CompositeInfo = { buffer: await ChangeColorGetBuffer(extraLeg, this.parts.skinColor), x: this.w_h * 0.5 + 24, y: this.w_h * 0.5 - 16, tile: 0};
        const l_arm: CompositeInfo = { buffer: await ChangeColorGetBuffer(arm, this.parts.skinColor), x: this.w_h * 0.5 + 4, y: this.w_h * 0.5 - 20, tile: 5}
        const r_arm: CompositeInfo = { buffer: await ChangeColorGetBuffer(arm, this.parts.skinColor), x: this.w_h * 0.5 + 4, y: this.w_h * 0.5 + 10, tile: -1}
        const body: CompositeInfo = { buffer: await ChangeColorGetBuffer(r_body, this.parts.skinColor), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0 }
        const ren_r_f: CompositeInfo = { buffer: this.parts.feet != 0 ? r_feet : await ChangeColorGetBuffer(r_feet, this.parts.skinColor), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0}
        const ren_l_f: CompositeInfo = { buffer: this.parts.feet != 0 ? l_feet : await ChangeColorGetBuffer(l_feet, this.parts.skinColor), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0 }
        
        arr.push(extra, l_arm, r_arm, body, ren_l_f, ren_r_f)
        arr.push(await this.renderFace())
        // array body end

        if(this.parts.shirt != 0) { arr.push(await this.renderShirt())}
        if(this.parts.hair!.hair != 0) { arr.push(await this.renderHair()) }
        if(this.parts.hand != 0) { arr.push(await this.renderHand()) }
        if(this.parts.neck != 0) { arr.push(await this.renderNeck()) }
        if(this.parts.pant != 0) { arr.push(await this.renderPant()) }
        if(this.parts.hat != 0) { arr.push(await this.renderHat()) }
        if(this.parts.back != 0) { arr.push(await this.renderBack()) }
        if([3360, 3362, 3364, 3366, 3368, 3370].includes(this.parts.shirt!)) { arr.push(await this.renderVest()) }

        arr.sort((x, y) => x.tile - y.tile); // sort arr list for tile 
        return arr.map(({ buffer, x, y }) => ({
            input: buffer,
            left: y,
            top: x,
        }))  
    }

    public async renderPlayer() {
        const getRenders = await this.getRenders();

        return sharp({
            create: {
              width: this.w_h,
              height: this.w_h,
              channels: 4,
              background: {r: 0, g: 0, b: 0, alpha: 0}
            }
            
        }).composite(getRenders)
    }
}