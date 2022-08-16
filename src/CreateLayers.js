import {ShapePath, Color, Text, Layer} from 'sketch/dom';

function createCellBg(name,basicColor,borderStyle){
    return new ShapePath({
        shapeType: ShapePath.ShapeType.Rectangle,
        name: name,
        frame: {
            x: 0,
            y: 0,
            width: 120,
            height: 40,
        },
        style: {
            fills: [
            {
                fillType: Color,
                enabled: true,
                color: basicColor,
            }
            ],
            borders: [...borderStyle],
            styleType: Layer,
        },
    })
}

function createCellText(style,b_left) {
    const cellText = new Text({
        text: "text",
        name: "layerName",
        style: style
    })

    cellText.adjustToFit();
    cellText.frame.x = b_left;
    cellText.frame.y = (40 - cellText.frame.height) / 2;

    return cellText;
}

function createBorderBottom(basicColor) {
    return new ShapePath({
        shapeType: ShapePath.ShapeType.Rectangle,
        name: "borderBottom",
        frame: {
            x: 0,
            y: 39,
            width: 120,
            height: 1,
        },
        style: {
            fills: [
                {
                fillType: Color,
                enabled: true,
                color: basicColor,
                }
            ],
            borders: [],
            styleType: Layer,
        },
    })
}

export {createCellBg,createCellText,createBorderBottom}