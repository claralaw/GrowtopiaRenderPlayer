import sharp from "sharp";
import { tint, shadeColor } from "../Utils/Recolor";
import { BodyParts, CompositeInfo, DHorn, Face, Skin } from "../types/Types";
import { ItemData } from "../Utils/ItemsDat";

export class Render {

    /**
     * 
     * @param {BodyParts} parts
     * @param spriteLocation Item sprites location
     * @param itemData Item data to read
     * @param w_h width and height
     */
    
    constructor(private parts: Partial<BodyParts> = {}, private spriteLocation: string, private itemData: ItemData[], private w_h: number) {
        this.parts.back = this.parts.back! || 0;
        this.parts.feet = this.parts.feet! || 0;
        this.parts.neck = this.parts.neck! || 0;
        this.parts.pant = this.parts.pant! || 0;
        this.parts.hand = this.parts.hand! || 0;
        this.parts.hat = this.parts.hat! || 0;
        this.parts.shirt = this.parts.shirt! || 0;

        this.parts.skin = {
            skinColor: this.parts.skin?.skinColor || Skin.TONE4
        }

        this.parts.hair = {
            hair: this.parts.hair?.hair || 0,
            dye: this.parts.hair?.dye
        }
        
        this.parts.face = {
            expression: this.parts.face?.expression || Face.DEFAULT,
            face: this.parts.face?.face || 0,
            eyeDrop: this.parts.face?.eyeDrop,
            eyeLens: this.parts.face?.eyeLens
        }

        this.parts.options = {
            d_horn: this.parts.options?.d_horn || DHorn.UNICORN
        }
    }

    /**
     * 
     * @private 
     */

    private async getItemInfo(ItemID: number) {
        return this.itemData.find(({item_id}) => item_id == ItemID);
    }

    /**
     * 
     * @private 
     */

    private async renderHat(): Promise<CompositeInfo> {
        let i_hat = await this.getItemInfo(this.parts.hat!); 
        let x = i_hat?.textureX, y = i_hat?.textureY;

        switch(i_hat!.item_id) {
            case 4746: { // Diamond Horn
                if(this.parts.options?.d_horn == DHorn.DEVIL) { x! += 1 }
                else if(this.parts.options?.d_horn == DHorn.GOAT) { x! += 2 }
            }

        }

        let render = await sharp(this.spriteLocation + `${i_hat!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: x! * 32, top: y! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer();

        return {
            buffer: render,
            x: this.w_h * 0.5 - 64,
            y: this.w_h * 0.5 - 32,
            tile: 6,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderHair(): Promise<CompositeInfo> {
        let i_hair = await this.getItemInfo(this.parts.hair?.hair!);
        let x = this.w_h * 0.5 - 64, y = this.w_h * 0.5 - 32;
        let render = await sharp(this.spriteLocation + `${i_hair!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_hair!.textureX! * 32, top: i_hair!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer()

        switch(i_hair?.item_texture) {
            case "player_hairhair.rttex": {
                if(
                    (i_hair.textureX == 6 && i_hair.textureY == 7) ||
                    (i_hair.textureX == 4 && i_hair.textureY == 0) ||
                    (i_hair.textureX == 0 && i_hair.textureY == 4) ||
                    (i_hair.textureX == 4 && i_hair.textureY == 7) ||
                    (i_hair.textureX == 1 && i_hair.textureY == 4) ||
                    (i_hair.textureX == 2 && i_hair.textureY == 5) ||
                    (i_hair.textureX == 7 && i_hair.textureY == 3) ||
                    (i_hair.textureX == 4 && i_hair.textureY == 3)
                ) {
                    x = this.w_h * 0.5 - 32;
                }
            }
            case "player_hairhair2.rttex": {
                if(
                    (i_hair.textureX == 7 && i_hair.textureY == 6)
                ) {
                    x = this.w_h * 0.5 - 32;
                }
            }
        }
        
        return {
            buffer: !this.parts.hair?.dye ? render : await tint(render, {r: this.parts.hair.dye.r, g: this.parts.hair.dye.g, b: this.parts.hair.dye.b}),
            x: x,
            y: y,
            tile: 5
        }
    }

    /**
     * 
     * @private 
     */

    private async renderNeck(): Promise<CompositeInfo> {
        let i_neck = await this.getItemInfo(this.parts.neck!);
        let neck = await sharp(this.spriteLocation + `${i_neck!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_neck!.textureX! * 32, top: i_neck!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer();

        switch (i_neck!.item_id) {
            /* Silk Tie */
            case 3372: neck = await tint(neck, {r: 200, g: 0, b: 0}); break; //red tie
            case 3374: neck = await tint(neck, {r: 255, g: 255, b: 0}); break; //yellow tie
            case 3376: neck = await tint(neck, {r: 40, g: 40, b: 40}); break; //black tie
            case 3378: neck = await tint(neck, {r: 0, g: 0, b: 188}); break; //blue tie
            case 3380: neck = await tint(neck, {r: 130, g: 130, b: 130}); break; // grey tie;
            /* */
            default: neck;
                break;
        }

        return {
            buffer: neck,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 3,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderPant(): Promise<CompositeInfo> {
        let pant = await this.getItemInfo(this.parts.pant!)

        return {
            buffer: await sharp(this.spriteLocation + `${pant!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: pant!.textureX! * 32, top: pant!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderHand(): Promise<CompositeInfo> {
        let hand = await this.getItemInfo(this.parts.hand!)

        return {
            buffer: await sharp(this.spriteLocation + `${hand!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: hand!.textureX! * 32, top: hand!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 + 4,
            y: this.w_h * 0.5 - 46,
            tile: 5,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderShirt(): Promise<CompositeInfo> {
        let i_shirt = await this.getItemInfo(this.parts.shirt!);
        let shirt = await sharp(this.spriteLocation + `${i_shirt!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_shirt!.textureX! * 32, top: i_shirt!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        switch(i_shirt!.item_id) {
             /* Silk Vest */
             case 3360: shirt = await tint(shirt, {r: 255, g: 50, b: 50}); break; //red vest
             case 3362: shirt = await tint(shirt, {r: 50, g: 255, b: 50}); break; //green vest
             case 3364: shirt = await tint(shirt, {r: 0, g: 50, b: 255}); break; //blue vest
             case 3366: shirt = await tint(shirt, {r: 255, g: 0, b: 255}); break; //purple vest
             case 3368: shirt = await tint(shirt, {r: 200, g: 200, b: 200}); break; // grey vest
             case 3370: shirt = await tint(shirt, {r: 55, g: 55, b: 55}); break; //black vest
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

    /**
     * 
     * @private 
     */

    private async renderBack(): Promise<CompositeInfo> {
        let i_back = await this.getItemInfo(this.parts.back!)
        let x = this.w_h * 0.5 - 32, y = this.w_h * 0.5 - 32;
        let back = await sharp(this.spriteLocation + `${i_back!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_back!.textureX! * 32, top: i_back!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        switch(i_back!.item_id) {

            // auras
            case 4970: case 4972: case 6284: case 8084: case 8024: case 8026:
            case 3114: back = await sharp(this.spriteLocation + `${i_back!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_back!.textureX! * 32, top: i_back!.textureY! * 32 }).resize(104, 104, {kernel: sharp.kernel.nearest}).toBuffer(); x = this.w_h * 0.5 - 68; y = this.w_h * 0.5 - 52; break;

            default: back;
        }

        return {
            buffer: back,
            x: x,
            y: y,
            tile: -2,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderFace(): Promise<CompositeInfo> {
        let i_face = await this.getItemInfo(this.parts.face?.face!);

        return {
            buffer: await sharp(this.spriteLocation + `${i_face!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: i_face!.textureX! * 32, top: i_face!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer(),
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 4,
        }
    }

    /**
     * 
     * @private 
     */

    private async renderVest(): Promise<CompositeInfo> {
        let data = await this.getItemInfo(this.parts.shirt!);
        let vest = await sharp(this.spriteLocation + `${data!.item_texture?.replace(".rttex", ".png")}`).extract({ width: 32, height: 32, left: (data!.textureX! + 1) * 32, top: data!.textureY! * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        return {
            buffer: vest,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1
        }
    }

    /**
     * 
     * @private 
     */

    private async renderExpression(): Promise<CompositeInfo> {
        let x = 0, y = 0;

        switch(this.parts.face?.expression) {
            case Face.DEFAULT: x = 0, y = 0; break;
            case Face.SMILE: x = 0, y = 1; break;
            case Face.SAD: x = 1, y = 1; break;
            case Face.OMG: x = 3, y = 1; break;
            case Face.MAD: x = 4, y = 1; break;
            case Face.LOL: x = 7, y = 1; break;
            case Face.WINK: x = 4, y = 2; break;
            case Face.TROLL: x = 6, y = 2; break;
            case Face.HMM: x = 1, y = 2; break;
        }

        let eyeDrop = await sharp(this.spriteLocation + `player_eyes.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let eyeLens = await sharp(this.spriteLocation + `player_eyes2.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let mouth = await sharp(this.spriteLocation + `player_face.png`).extract({ width: 32, height: 32, left: x * 32, top: y * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();
        let eyelid = await sharp(this.spriteLocation + `player_eyes.png`).extract({ width: 32, height: 32, left: x * 32, top: (y + 4 )* 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).png().toBuffer();

        let end = await sharp({create: { width: this.w_h, height: this.w_h, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0} }})
        .composite([
            {input: !this.parts.face!.eyeDrop! ? await tint(eyeDrop, {r: 255, g: 255, b: 255}) : await tint(eyeDrop, { r: this.parts.face!.eyeDrop!.r, g: 255, b:255 }), top: 0, left: 0},
            {input: await tint(eyelid, shadeColor({ r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}, 2)), top: 0, left: 0},
            {input: this.parts.face?.expression == (Face.DEFAULT) ? await tint(mouth, shadeColor({ r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}, -60)) : mouth, top: 0, left: 0},
            {input: !this.parts.face!.eyeLens! ? await tint(eyeLens, { r: 0, g: 0, b: 0 }) : await tint(eyeLens, { r: this.parts.face!.eyeLens!.r, g: this.parts.face!.eyeLens!.g, b: this.parts.face!.eyeLens!.b }), top: 0, left: 0},
        ]).png().toBuffer();

        return {
            buffer: end,
            x: this.w_h * 0.5 - 32,
            y: this.w_h * 0.5 - 32,
            tile: 1,
        }
    }

    /**
     * 
     * @private 
     */

    private async getRenders() {
        const arr: CompositeInfo[] = [];
        const i_feet = await this.getItemInfo(this.parts.feet!);

        //if(this.parts.skin?.skinColor == Skin.SUB_CYAN || this.parts.skin?.skinColor == Skin.SUB_PURPLE) { this.parts.skin.opacity = 0.4; this.parts.skin.overlay_opac = 70; }

        // read
        const extraLeg = await sharp(this.spriteLocation + "player_extraleg.png").resize(32,32, {kernel: sharp.kernel.nearest}).toBuffer()
        const arm = await sharp(this.spriteLocation + "player_arm.png").resize(16,32, {kernel: sharp.kernel.nearest}).toBuffer()
        const r_body = await sharp(this.spriteLocation + "player_head.png").extract({width: 32, height: 32, left: 0, top: 0}).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer()
        const r_feet = await sharp(this.spriteLocation + `${(this.parts.feet) != 0 ? i_feet!.item_texture?.replace(".rttex", ".png") : "player_feet.png"}`).extract({ width: 32, height: 32, left: (this.parts.feet != 0 ? i_feet!.textureX! : 0) * 32, top: ((((this.parts.feet != 0 ? i_feet!.textureY! : 0)) * 2) * 32) + 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer() 
        const l_feet = await sharp(this.spriteLocation + `${(this.parts.feet) != 0 ? i_feet!.item_texture?.replace(".rttex", ".png") : "player_feet.png"}`).extract({ width: 32, height: 32, left: (this.parts.feet != 0 ? i_feet!.textureX! : 0) * 32, top: (((this.parts.feet != 0 ? i_feet!.textureY! : 0)) * 2) * 32 }).resize(64,64, {kernel: sharp.kernel.nearest}).toBuffer() 
        // read end

        // array body
        const extra: CompositeInfo = { buffer: await tint(extraLeg, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 + 24, y: this.w_h * 0.5 - 16, tile: 0};
        const l_arm: CompositeInfo = { buffer: await tint(arm, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 + 4, y: this.w_h * 0.5 - 20, tile: 6}
        const r_arm: CompositeInfo = { buffer: await tint(arm, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 + 4, y: this.w_h * 0.5 + 10, tile: -1}
        const body: CompositeInfo = { buffer: await tint(r_body, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0 }
        const ren_r_f: CompositeInfo = { buffer: this.parts.feet != 0 ? r_feet : await tint(r_feet, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0}
        const ren_l_f: CompositeInfo = { buffer: this.parts.feet != 0 ? l_feet : await tint(l_feet, { r: this.parts.skin!.skinColor!.r, g: this.parts.skin!.skinColor!.g, b: this.parts.skin!.skinColor!.b}), x: this.w_h * 0.5 - 32, y: this.w_h * 0.5 - 32, tile: 0 }
        
        arr.push(extra, l_arm, r_arm, body, ren_l_f, ren_r_f)
        arr.push(await this.renderExpression())
        // array body end

        if(this.parts.shirt != 0) { arr.push(await this.renderShirt())}
        if(this.parts.hair!.hair != 0) { arr.push(await this.renderHair()) }
        if(this.parts.hand != 0) { arr.push(await this.renderHand()) }
        if(this.parts.neck != 0) { arr.push(await this.renderNeck()) }
        if(this.parts.pant != 0) { arr.push(await this.renderPant()) }
        if(this.parts.hat != 0) { arr.push(await this.renderHat()) }
        if(this.parts.back != 0) { arr.push(await this.renderBack()) }
        if(this.parts.face?.face != 0) { arr.push(await this.renderFace()) }
        if([3360, 3362, 3364, 3366, 3368, 3370].includes(this.parts.shirt!)) { arr.push(await this.renderVest()) }

        arr.sort((x, y) => x.tile - y.tile); // sort arr list for tile 
        return arr.map(({ buffer, x, y }) => ({
            input: buffer,
            left: y,
            top: x,
        }))  
    }

    /**
     * Render the character
     * @returns {Buffer}
     */
    public async renderPlayer(): Promise<Buffer> {
        const getRenders = await this.getRenders();

        return sharp({
            create: {
              width: this.w_h,
              height: this.w_h,
              channels: 4,
              background: {r: 0, g: 0, b: 0, alpha: 0}
            }
            
        }).composite(getRenders).png().toBuffer();
    }
}