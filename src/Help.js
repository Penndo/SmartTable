import sketch from 'sketch';
import {SymbolMaster} from 'sketch/dom';

var document = context.document;
var documentData = document.documentData();

function getMaxValue(arr) {
    let maxValue = "";
    if (isNaN(Math.max(...arr))) {
      maxValue = arr[0]
    } else {
      maxValue = Math.max(...arr)
    }
    return maxValue
}

function hexToRgba(hex){
    let rgba = {
        r:parseInt("0x" + hex.slice(1,3)),
        g:parseInt("0x" + hex.slice(3,5)),
        b:parseInt("0x" + hex.slice(5,7)),
        a:parseInt("0x" + hex.slice(7,9))/255
    }
    return (
        `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
    )
}

function createNewSymbolMaster(TH_TD,modalName,layersArr,styles){
    var symbolsPage = documentData.symbolsPageOrCreateIfNecessary();

    let position;

    let symbolSource_name = "SmartTable" + "/" + modalName + "/" + TH_TD;
    let symbolSource_name_reg = "SmartTable" + "/" + modalName + "\/" + TH_TD + "[-]?.*";

    let contains = documentData.allSymbols();
    let predicate = NSPredicate.predicateWithFormat("name MATCHES[c] %@", symbolSource_name_reg);
    let symbolSources = contains.filteredArrayUsingPredicate(predicate);
    let matchVersionCode = /\d*$/;
    let versionCodeArr = [];

    symbolSources.forEach((symbol)=>{
        let symbolName = symbol.name();
        if(matchVersionCode.test(symbolName)){
            versionCodeArr.push(symbolName.match(matchVersionCode)[0])
        }
        
    });

    let lastVersionCode = Math.max(...versionCodeArr);
    let willUsedVersionCode = lastVersionCode + 1;
    let matchedCount = symbolSources.count();
    let willUsedSymbolMaster;

    if(matchedCount < 1){
        position = symbolsPage.originForNewArtboardWithSize(nil);
        let symbol = new SymbolMaster({
            name:symbolSource_name,
            layers:layersArr,
            parent:symbolsPage,
            frame:{
                x:position.x,
                y:position.y,
                width:layersArr[0].frame.width,
                height:layersArr[0].frame.height
            },
        });
        willUsedSymbolMaster = symbol.sketchObject;

    }else{
        //???????????????????????????????????????????????? false???
        let matched = false
        //?????????????????????????????????????????????????????????????????? matched ????????? true
        for (let symbolMaster of Array.from(symbolSources)){
            let symbolMasterContainedLayers = symbolMaster.layers();
            let equal;
            let equals = [];//???????????? layer ?????????????????????????????????????????????
            symbolMasterContainedLayers.forEach((layer,index)=>{
                let layerName = layer.name();
                let jsLayer = sketch.fromNative(layer);
                //???????????????????????????????????????????????????????????????????????????????????????????????????????????????
                if(symbolMasterContainedLayers.count() == layersArr.length && layer.name() == layersArr[index].name){
                    switch (layerName.substring(0)) {
                        case "cellBg_interval":
                            let cellBg_interval_color = hexToRgba(jsLayer.style.fills[0].color.substring(0,9)).toUpperCase() == styles.cellBg.intervalColor.toUpperCase();
                            equals.push(cellBg_interval_color);
                            break;
                        case "cellBg":
                            let cellBgEqual = hexToRgba(jsLayer.style.fills[0].color.substring(0,9)).toUpperCase() == styles.cellBg.color.toUpperCase();
                            let cellBgBorder = true;
                            if(jsLayer.style.borders[0] == undefined && styles.cellBg.border == "" ){
                                console.log("1")
                                cellBgBorder = true;
                            }else if(jsLayer.style.borders[0] != undefined && styles.cellBg.border != ""){
                                cellBgBorder = hexToRgba(jsLayer.style.borders[0].color.substring(0,9)) == styles.cellBg.border;
                            }else{
                                console.log("3")
                                cellBgBorder = false;
                            }
                            let cellBgStyleEqual = cellBgEqual && cellBgBorder;
                            equals.push(cellBgStyleEqual);
                            break;
                        case "layerName":
                            let textColor = hexToRgba(jsLayer.style.textColor.substring(0,9)).toUpperCase() == styles.text.textColor.toUpperCase();
                            let fontSize = jsLayer.style.fontSize == styles.text.fontSize;
                            let fontWeight = jsLayer.style.fontWeight == styles.text.fontWeight;
                            let padding_left = jsLayer.frame.x == styles.padding.left;
                            let textStyleEqual = textColor && fontSize && fontWeight && padding_left;
                            equals.push(textStyleEqual);
                            break;
                        case "borderBottom":
                            let borderBottomEqual = hexToRgba(jsLayer.style.fills[0].color.substring(0,9)).toUpperCase() == styles.borderBottom.color.toUpperCase();
                            equals.push(borderBottomEqual)
                            break;
                        default:
                            break;
                    }
                }else{
                    equals.push(false)
                }                
            })
            equal = equals.every((a) => a == true);
            //????????????????????????????????????????????????????????????????????????????????????????????????
            if (equal) {
                matched = true;
                willUsedSymbolMaster = symbolMaster;
                break;
            };
        }

        //???????????????????????????????????????
        if(!matched){
            position = symbolsPage.originForNewArtboardWithSize(nil);
            let symbol = new SymbolMaster({
                name:symbolSource_name + "-V" + willUsedVersionCode,
                layers:layersArr,
                parent:symbolsPage,
                frame:{
                    x:position.x,
                    y:position.y,
                    width:layersArr[0].frame.width,
                    height:layersArr[0].frame.height
                },
            });
            willUsedSymbolMaster = symbol.sketchObject;
        }
    }

    return willUsedSymbolMaster;
}

export {createNewSymbolMaster,getMaxValue}
