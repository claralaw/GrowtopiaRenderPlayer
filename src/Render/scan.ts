import sharp from "sharp";
import { createWorker } from "tesseract.js";
import { ItemData } from "../Utils/ItemsDat";
import { BodyParts, clothingType } from "../types/Types";

export class Scanner {
    private base?: Buffer;
    public itemNames?: string[];

    constructor(public image: Buffer | string, private itemData: ItemData[]) {}

    private checkUrl(str: string) {
       const regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

       return regex.test(str);
    }

    private async privateHandleImage() {
        if(Buffer.isBuffer(this.image)) {
            return this.base = this.image;
        }
        else {
            if(this.checkUrl(this.image)) {
               this.base = Buffer.from(await (await fetch(this.image)).arrayBuffer());
            }
            else {
                return this.base = await sharp(this.image).png().toBuffer();
            }
        }
    }

    private async colorOnlyText() {
        await this.privateHandleImage();

        const buf = await sharp(this.base).ensureAlpha().raw().toBuffer({ resolveWithObject: true }).then(async ({ data, info }) => {
            for(let i = 0; i < data.length; i += 4) {
                if((data[i] != 252 && data[i + 1] != 230 && data[i + 2] != 186)) {
                    data[i] = 0;
                    data[i+1] = 0;
                    data[i+2] = 0;
                }
            }
    
            return await sharp(data, {raw: { width: info.width, height: info.height, channels: 4 }}).withMetadata({density: 70}).png().toBuffer(); //TODO
        })

        return this.base = buf;
    }

    private async scanImage() {
        await this.colorOnlyText();

        const worker = await createWorker("eng");
        const recognize = await worker.recognize(this.base!);

        let text = recognize.data.text.split("\n").filter(str => str);
        await worker.terminate();

        return this.itemNames = text;
    }

    public async getItems() {
        await this.scanImage();
        const obj: BodyParts = {
            hair: {hair: 0},
            face: {face: 0}
        };

        this.itemNames?.forEach(async (str, i) => {
            const itemInfo = this.itemData.find(({item_name}) => {return item_name?.toLowerCase() == str.toLowerCase()});

            switch(itemInfo?.clothingType) {
                case clothingType.HAT:
                    obj.hat = itemInfo.item_id; break;
                case clothingType.SHIRT:
                    obj.shirt = itemInfo.item_id; break;
                case clothingType.PANT:
                    obj.pant = itemInfo.item_id; break;
                case clothingType.FEET:
                    obj.feet = itemInfo.item_id; break;
                case clothingType.FACE:
                    obj.face!.face = itemInfo.item_id; break;    
                case clothingType.HAND:
                    obj.hand = itemInfo.item_id; break;
                case clothingType.HAIR:
                    obj.hair!.hair = itemInfo.item_id; break;
                case clothingType.NECK:
                    obj.neck = itemInfo.item_id; break;                     
            }
        })

        return obj;
    }
    
}
