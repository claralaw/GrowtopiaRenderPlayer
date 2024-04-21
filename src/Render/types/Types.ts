export interface CompositeInfo {
    buffer: Buffer;
    x: number;
    y: number;
    tile: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
}

export enum Face {
    DEFAULT, 
    SMILE, 
    SAD,
    OMG,
    MAD,
    LOL,
    WINK,
    TROLL,
    HMM // idk the name ':/'
}

export interface BodyParts {
    skin: {
        skinColor: Color;
        //opacity?: number; 
        //overlay_opac?: number; 
    }
    feet: number;
    shirt: number;
    hand: number;
    neck: number;
    pant: number;
    hat: number;
    back: number;
    hair: {
        hair: number;
        dye?: Color; 
    }
    face: {
        face?: number;
        expression: Face,
        eyeLens?: Color; 
        eyeDrop?: Color; 
    }
}

export const Skin = {
    SLIMED: {r: 114, g: 231, b: 196},

    //SUB_PURPLE: "#6C2477",
    //SUB_CYAN: "#4E9CB3",
    
    TONE1: { r: 120, g: 92, b: 80 },
    TONE2: { r: 150, g: 114, b: 100 },
    TONE3: { r: 180, g: 138, b: 120 },
    TONE4: { r: 195, g: 149, b: 130 },
    TONE5: { r: 225, g: 172, b: 150 },
    TONE6: { r: 255, g: 195, b: 170 },
    TONE7: { r: 255, g: 206, b: 180 },
    TONE8: { r: 255, g: 229, b: 200 },
    TONE9: { r: 177, g: 221, b: 163 },
    TONE10: { r: 65, g: 194, b: 197 },
    TONE11: { r: 215, g: 75, b: 43 },
    TONE12: { r: 65, g: 138, b: 42 },
    TONE13: { r: 169, g: 81, b: 213 },
    TONE14: { r: 240, g: 240, b: 240 },
    TONE15: { r: 61, g: 122, b: 211 },
    TONE16: { r: 177, g: 203, b: 239 },
    TONE17: { r: 255, g: 148, b: 11 },
    TONE18: { r: 233, g: 71, b: 86 }
}