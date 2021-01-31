const { rgbToHex } = require('./rgb-hex.general')

module.exports.writeText = (text, size, color, position, ctx, canvas, options) => {
    const [x, y] = position;

    let textCalculatedColor;
    let textAlign;

    if(options){
        if(options.background && !options.writeTextWithTitle){
            ctx.font =  `${size}px random-font`;
            ctx.textBaseline = 'top';
            ctx.fillStyle = options.background;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(canvas.width / 2 - textWidth / 2 - 20, y - 12, textWidth + 40, 90);
            if(options.ornaments){
                const ornament = options.ornaments;
                ctx.drawImage(ornament, canvas.width / 2 + textWidth / 2 + 30, y, 70, 70);
                ctx.drawImage(ornament, canvas.width / 2 - textWidth / 2 - 100, y, 70, 70);
            }
        }
        if(options.calculatedColor){
            ctx.font =  `${size}px random-font`;
            const rgb = ctx.getImageData(canvas.width / 2, y, 1, 1).data;
            const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                      (parseInt(rgb[1]) * 587) +
                      (parseInt(rgb[2]) * 114)) / 1000);
            textCalculatedColor = (brightness > 125) ? '#000000' : '#ffffff';
        }
        if(options.writeTextWithTitle){
            ctx.font =  `${size}px random-font`;
            ctx.textBaseline = 'top';
            ctx.fillStyle = options.background;
            const textWidth = ctx.measureText(text).width;
            const xs = canvas.width / 2 - textWidth / 2 - 20;
            const ys = y - 12;
            ctx.fillRect(xs, ys, textWidth + 40, 90);
            this.writeText(options.writeTextWithTitle, 35, '#fff', [xs, ys - 47], ctx, canvas, { calculatedColor: true, textAlign: 'left' });
        }
        if(options.textAlign){
            textAlign = options.textAlign;
        }
    }

    ctx.font =  `${size}px random-font`;
    ctx.fillStyle = textCalculatedColor ? textCalculatedColor : color;
    ctx.textAlign = `${textAlign ? textAlign : 'center'}`;
    ctx.fillText(text, x == 0 ? canvas.width / 2 : x, y);
}