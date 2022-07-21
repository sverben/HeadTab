/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

const battery = document.getElementById("battery");
const canvas = document.createElement("canvas");
canvas.width = 75;
canvas.height = 110;
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#ffffff";
ctx.fillStyle = "#ffffff";
ctx.lineWidth = 8;
roundRect(ctx, 20, 0, 35, 10, {tr: 5, tl: 5}, true, false);
roundRect(ctx, 4, 14, 67, 92, 10, false, true);

ctx.fillStyle = "#90EE90FF";
const batteryManager = await navigator.getBattery();
const level = batteryManager.level;
roundRect(ctx, 12, 22 + 76 - 76 * level, 51, 76 * level, 7, true, false);

battery.src = canvas.toDataURL();
battery.title = `Battery ${Math.round(level * 100)}%${batteryManager.charging ? ", charging" : ""}`