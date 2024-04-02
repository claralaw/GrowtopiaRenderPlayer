const Jimp = require("jimp");

export async function ChangeColorGetBuffer(buffer, hexColor, cb, opacity = 1) { // colorizing with jimp is much funny
    const image = await Jimp.read(buffer);

    const color1 = image.opacity(opacity).color([{ apply: 'mix', params: [hexColor, cb] }]);
    const buffer_img = await image.composite(color1, 0, 0, {mode: Jimp.BLEND_MULTIPLY}).getBufferAsync(Jimp.MIME_PNG);
    if(!buffer_img) throw Error("Error occured while changing color")
    else return buffer_img;
}

// you said no no no, i said no no no
// you said take me home i said dom perignon
// you said no no no, i said no no no, no no no no
// hasta la vida loca loca loca loca
// te encanta la musica te toca toca toca

export function shadeColor(color, amount) { // negative darker, positive lighter
    color = color.replace(/^#/, '')
    if (color.length === 3) color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
  
    let [r, g, b] = color.match(/.{2}/g);
    ([r, g, b] = [parseInt(r, 16) + amount, parseInt(g, 16) + amount, parseInt(b, 16) + amount])
  
    r = Math.max(Math.min(255, r), 0).toString(16)
    g = Math.max(Math.min(255, g), 0).toString(16)
    b = Math.max(Math.min(255, b), 0).toString(16)
  
    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b
  
    return `${rr+gg+bb}`
}