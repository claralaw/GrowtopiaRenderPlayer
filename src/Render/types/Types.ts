export enum Face {
    DEFAULT, SMILE
}

export interface DyeTypes {
    r: number;
    g: number;
    b: number
}

export interface CompositeInfo {
    buffer: Buffer;
    x: number;
    y: number;
    tile: number;
}

export interface BodyParts {
    skin: {
        skinColor: string;
        opacity?: number; // change 0-1
        overlay_opac?: number; // change 60-100
    }
    feet: number;
    shirt: number;
    hand: number;
    neck: number;
    pant: number;
    hat: number;
    back: number;
    hair?: {
        hair: number;
        dye?: DyeTypes;
    }
    face: {
        face?: number;
        expression: Face,
        eyeLens?: DyeTypes;
        eyeDrop?: DyeTypes;
    }
}

export const Skin = {
    SLIMED: "#72E7C4", // idk why i added this

    SUB_PURPLE: "#6C2477",
    SUB_CYAN: "#4E9CB3",
    
    TONE1: "#785C50",
    TONE2: "#967264",
    TONE3: "#B48A78",
    TONE4: "#C39582",
    TONE5: "#E1AC96",
    TONE6: "#FFC3AA",
    TONE7: "#FFCEB4",
    TONE8: "#FFE5C8",
    TONE9: "#B1DDA3",
    TONE10: "#41C2C5",
    TONE11: "#D74B2B",
    TONE12: "#418A2A",
    TONE13: "#A951D5",
    TONE14: "#F0F0F0",
    TONE15: "#3D7AD3",
    TONE16: "#B1CBEF",
    TONE17: "#FF940B",
    TONE18: "#E94756"
}