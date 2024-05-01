import { ItemData } from "../Utils/ItemsDat";
import { BodyParts } from "./Types";

export class Render {
    constructor(parts: Partial<BodyParts>, spriteLocation: string, itemData: ItemData[], w_h: number);

    renderPlayer(): Buffer;
}