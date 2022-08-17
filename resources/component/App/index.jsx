import * as React from "react";
import {useRef, useState } from "react";

import {createIDB, getAllValue} from "../Public/IDB";
import { shearData,recalculate_CellSize } from "../Public/Tools";
import Table from "../Table";
import ConstrolSlider from "../ConstrolSlider";
import { originControlData, originCellSize, originHead, originData} from "../Public/originContant";

import styles from "./index.module.less";

const defaultStoreName = "defaultStore";
const defaultHistoryName = "historyStore";
const _originData = originData();
const _originHead = originHead();

export default function App(){
    const initialInformation = {
        controlData:originControlData,
        renderData:_originData,
        renderHead:_originHead,
        cellSize:originCellSize,
        dynamicData:_originData,
        dynamicHead:_originHead,
        defaultStorageData:[],
        historyStorageData:[{id:1,history:""}]
    }

    const initialCellMarker = {
        offsetLeft:-100,
        offsetTop:-100,
        offsetWidth:0,
        offsetHeight:0
    }

    function reducer(state, action) {
        switch (action.type) {
            case "controlData":
                return {
                    ...state,
                    controlData:action.value
                }
            case "renderData":
                return {
                    ...state,
                    renderData:action.value
                }
            case "renderHead":
                return {
                    ...state,
                    renderHead:action.value
                }
            case "cellSize":
                return {
                    ...state,
                    cellSize:action.value
                }
            case "dynamicHead":
                return {
                    ...state,
                    dynamicHead:action.value
                }
            case "dynamicData":
                return {
                    ...state,
                    dynamicData:action.value
                }
            case "all":
                return {
                    ...action.value
                }
            default:
                return state
        }
    }

    function reducer_cellMarker(state, action) {
        switch (action.type) {
            case "top":
                return {
                    ...state,
                    offsetTop:action.value
                }
            case "left":
                return {
                    ...state,
                    offsetLeft:action.value
                }
            case "width":
                return {
                    ...state,
                    offsetWidth:action.value
                }
            case "height":
                return {
                    ...state,
                    offsetHeight:action.value
                }
            case "all":
                return {
                    ...action.value
                }
            default:
                return state
            }
    }

    const table_ref = useRef(null);

    const [information, dispatch] = React.useReducer(reducer, initialInformation)
    const [cellMarker_all, dispatch_cellMarker] = React.useReducer(reducer_cellMarker, initialCellMarker)
    const {controlData,renderData,renderHead,cellSize,dynamicData,dynamicHead,defaultStorageData,historyStorageData} = information
    const [headerIndependentStyle, setHeaderIndependentStyle] = useState(true);
    const [lastPickedColor,setLastPickedColor] = useState(controlData.fill.basicColor);
    const [fillInterval_usedCount, setFillInterval_usedCount] = React.useState(1);//隔行换色的开启次数，作为其key，每重新开启一次，重新创建一个新的组件
    const [colID, setColID] = useState(maxID(dynamicHead,"colID"))
    const [rowID, setRowID] = useState(maxID(dynamicData,"rowID"))
    const [tdIndex, setTdIndex] = useState(null)
    const [trIndex, setTrIndex] = useState(null)
    const [lastSelectedTdIndex, setLastSelectedTdIndex] = useState(null)
    const [lastSelectedTrIndex, setLastSelectedTrIndex] = useState(null)
    let cellMinWidth = Number(controlData.tbodyPadding.b_left) + Number(controlData.tbodyPadding.b_right) + 8;

    const [cellMarker_first, setCellMarker_first] = useState({
        offsetLeft:0,
        offsetTop:0,
        offsetWidth:0,
        offsetHeight:0
    })

    function getCellSize(data) {
        dispatch({type:"cellSize",value:data})
    }

    function getDynamicData(data) {
        dispatch({type:"dynamicData",value:data})
    }

    function getDynamicHead(data) {
        dispatch({type:"dynamicHead",value:data})
    }

    function getRenderData(data){
        dispatch({type:"renderData",value:data})
    }

    function getRenderHead(data) {
        dispatch({type:"renderHead",value:data})
    }

    function syncBodyStyleToHeader() {
        setHeaderIndependentStyle(true)
    }

    function getLastPickedColor(value) {
        setLastPickedColor(value)
    }

    function refreshInterval_usedCount(value){
        setFillInterval_usedCount(value)
    }

    function getColID(colID) {
        setColID(colID)
    }

    function getRowID(rowID) {
        setRowID(rowID)
    }

    function getTrIndex(trIndex) {
        setTrIndex(trIndex)
    }

    function getTdIndex(tdIndex) {
        setTdIndex(tdIndex)
    }

    function getLastSelectedTdIndex(tdIndex) {
        setLastSelectedTdIndex(tdIndex)
    }

    function getLastSelectedTrIndex(trIndex) {
        setLastSelectedTrIndex(trIndex)
    }

    function getCellMarker_first(obj) {
        setCellMarker_first(obj)
    }

    let getCellMarker_all = React.useCallback((obj)=>{
        dispatch_cellMarker({type:"all",value:obj})
    },[])

    function maxID(data,name){
        let IDArr = [];
        for(let i=0;i<data.length;i++){
            IDArr.push(data[i][name])
        };
        return Math.max(...IDArr)
    }

    //改变 Table 大小，代码待优化
    function resizeTableSize(value,typeName,propertyName) {
        if(typeName === "tableAmount"){
            if(propertyName === "cols"){
                changeColsCount(value,dynamicHead,dynamicData)
            }else{
                changeRowsCount(value,dynamicHead,dynamicData)
            }
        }
        else if(typeName === "tableWidth"){
            const count = controlData.tableAmount.cols, preCount = controlData.tableAmount.cols;
            let newCellSize = recalculate_CellSize(count,preCount,value,cellSize,cellMinWidth);
            getCellSize({...cellSize,...newCellSize})}
    }

    function headerIndependentStyle_condition(data) {
        const headerIndependentStyle_condition = 
            data.tbodyPadding.b_top !== data.theadPadding.h_top || 
            data.tbodyPadding.b_bottom !== data.theadPadding.h_bottom ||
            data.fill.basicColor !== data.theadFill.basicColor ||
            data.textStyle.basicColor !== data.theadTextStyle.basicColor ||
            data.textStyle.fontSize !== data.theadTextStyle.fontSize ||
            data.textStyle.fontWeight !== data.theadTextStyle.fontWeight;

        if(headerIndependentStyle_condition){
            setHeaderIndependentStyle(true)
        }else{
            setHeaderIndependentStyle(false)
        }
    }

    //从模板更新页面数据
    const refreshDataFromComponent = React.useCallback(() => {
        createIDB().then((db)=>{
            const defaultStorageData_result = Promise.resolve(getAllValue(db,defaultStoreName));
            const historyStorageData_result = Promise.resolve(getAllValue(db,defaultHistoryName));

            Promise.all([defaultStorageData_result,historyStorageData_result]).then((values)=>{
                
                const informationList = values[0];
                const selectes = values[1];
                if(!informationList.length) return false;
                const selectedName = selectes[0].history;
                let data = null;
                
                for(let i=0; i<informationList.length; i++){
                    if(informationList[i].title === selectedName){
                        data = informationList[i].information;
                        break;
                    }
                }

                dispatch({type:"all",value:{
                    controlData:data.controlData,
                    renderData:data.renderData,
                    renderHead:data.renderHead,
                    cellSize:data.cellSize,
                    dynamicData:data.renderData,
                    dynamicHead:data.renderHead,
                    defaultStorageData:informationList,
                    historyStorageData:selectes
                }})
                
                const {basicColor,intervalColor,switchState} = data.controlData.fill;

                if(switchState === true){
                    setLastPickedColor(intervalColor === "" ? basicColor : intervalColor);
                }else if(switchState === false){
                    setLastPickedColor(basicColor);
                }

                headerIndependentStyle_condition(data.controlData);
                getColID(maxID(data.renderHead,"colID"));
                getRowID(maxID(data.renderData,"rowID"));
            })
        })
    },[])

    function getControlData(name, data) {

        //用来判断表头样式和表格样式是否全等。如果不全等就让样式独立编辑。
        headerIndependentStyle_condition(controlData)

        //同步表格样式数据至表头
        function syncControlData() {
            let syncData = {}
            if(!headerIndependentStyle){     
                switch (name) {
                    case "tbodyPadding":
                        const {b_top,b_bottom} = data.tbodyPadding
                        syncData = {
                            theadPadding:{
                                h_top:b_top,
                                h_bottom:b_bottom
                            }
                        }
                        break;
                    case "fill":
                        syncData = {
                            theadFill:{
                                basicColor:data.fill.basicColor
                            }
                        };
                        break;
                    case "textStyle":
                        const {basicColor,fontSize,fontWeight} = data.textStyle;
                        syncData = {
                            theadTextStyle:{
                                basicColor:basicColor,
                                fontSize:fontSize,
                                fontWeight:fontWeight
                            }
                        };
                        break;
                    default:
                        break;
                }       
            };
            return {...syncData,...data}
        }
        dispatch({type:"controlData",value:{
            ...controlData,...syncControlData()
        }})
    }

    function changeColsCount(count,renderHead,renderData){

        let readyRenderHead = shearData(count,renderHead,colID,"colID",getColID);
        let readyRenderData = renderData.slice();

        let mergedHead = [];
        for(let i=0;i<readyRenderHead.length;i++){
            let col = {};
            readyRenderHead[i]["serialNumber"] = i;
            col["title"] = "";
            Object.assign(col, readyRenderHead[i]);
            mergedHead.push(col);
        };

        let mergedData = [];
        for(let i=0;i<readyRenderData.length;i++){
            let row = {};
            for(let j=0;j<readyRenderHead.length;j++){
                row[readyRenderHead[j]["colID"]] = "";
            }
            Object.assign(row, readyRenderData[i]);
            mergedData.push(row);
        };

        //处理掉行数据中多余的属性内容
        for(let i=0;i<mergedData.length;i++){
            for(let property in mergedData[i]){
                if(property !== "key" && property !== "rowID"){
                    let leave = false;
                    for(let j=0;j<mergedHead.length;j++){
                        if(property === mergedHead[j].colID.toString()){
                            leave = false;
                            break;
                        }else{
                            leave = true;
                        }
                    }
                    if(leave){
                        delete mergedData[i][property];
                    }
                }
            }
        }
        const preCount = controlData.tableAmount.cols;
        const tableWidth = controlData.tableWidth;

        let newCellSize = recalculate_CellSize(count,preCount,tableWidth,cellSize,cellMinWidth);
        dispatch({type:"all",value:{
            ...information,
            renderHead:mergedHead,
            renderData:mergedData.slice(0,controlData.tableAmount.rows),
            dynamicData:count >= renderHead.length ? mergedData :information.dynamicData,
            dynamicHead:count >= renderHead.length ? mergedHead :information.dynamicHead,
            controlData:{...controlData,tableAmount:{...controlData.tableAmount,cols:count}},
            cellSize:{...cellSize,...newCellSize}
        }})

        //重新设置高亮框的位置
        if(Math.min(tdIndex,lastSelectedTdIndex) + 1 > count){
            getTdIndex(null);
        }else if(Math.min(tdIndex,lastSelectedTdIndex)+1 <= count && Math.max(tdIndex,lastSelectedTdIndex) + 1 > count){
            getTdIndex(Math.min(tdIndex,lastSelectedTdIndex));
            getLastSelectedTdIndex(count-1);
        }else{
            return
        }

    }

    function changeRowsCount(count,renderHead,renderData){
        let readyRenderHead = renderHead.slice();
        let readyRenderData = shearData(count,renderData,rowID,"rowID",getRowID);

        let mergedData = [];
        for(let i=0;i<readyRenderData.length;i++){
            let row = {};
            for(let j=0;j<readyRenderHead.length;j++){
                row[readyRenderHead[j]["colID"]] = "";
            }
            Object.assign(row, readyRenderData[i]);
            mergedData.push(row);
        };

        dispatch({type:"all",value:{
            ...information,
            dynamicData:count >= renderData.length ? mergedData : information.dynamicData,
            renderData:mergedData,
            controlData:{...controlData,tableAmount:{...controlData.tableAmount,rows:count}}
        }})

        if(Math.min(trIndex,lastSelectedTrIndex) > count){
            getTrIndex(null);
        }else if(Math.min(trIndex,lastSelectedTrIndex) < count && Math.max(trIndex,lastSelectedTrIndex) > count){
            getTrIndex(Math.min(trIndex,lastSelectedTrIndex));
            getLastSelectedTrIndex(count);
        }else{
            return
        }
    }

    //切换模板更新初始数据
    function switchTemplate(){
        setFillInterval_usedCount(1)
        refreshDataFromComponent()
    }

    function backToInitialState(){
        createIDB().then((db)=>{
            const defaultStorageData_result = Promise.resolve(getAllValue(db,defaultStoreName));
            const historyStorageData_result = Promise.resolve(getAllValue(db,defaultHistoryName));

            Promise.all([defaultStorageData_result,historyStorageData_result]).then((values)=>{
                const _originData = originData();
                const _originHead = originHead();
                dispatch({type:"all",value:{
                    controlData:originControlData,
                    renderData:_originData,
                    renderHead:_originHead,
                    cellSize:originCellSize,
                    dynamicData:_originData,
                    dynamicHead:_originHead,
                    defaultStorageData:values[0],
                    historyStorageData:values[1]
                }})
            })
        })
    }

    //页面加载时，加载一次本地存储的数据
    React.useEffect(()=>{
        refreshDataFromComponent();
    },[refreshDataFromComponent])

    //
    return (
        <div 
            className={styles["container"]} 
            onContextMenu = {(e)=>{e.preventDefault()}}
        >
            <Table 
                trIndex = {trIndex}
                tdIndex = {tdIndex}
                lastSelectedTdIndex = {lastSelectedTdIndex}
                lastSelectedTrIndex = {lastSelectedTrIndex}
                cellMarker_first = {cellMarker_first}
                cellMarker_all = {cellMarker_all}
                getTrIndex = {getTrIndex}
                getTdIndex = {getTdIndex}
                getLastSelectedTrIndex = {getLastSelectedTrIndex}
                getLastSelectedTdIndex = {getLastSelectedTdIndex}
                getCellMarker_first = {getCellMarker_first}
                getCellMarker_all = {getCellMarker_all}
                changeColsCount = {changeColsCount}
                changeRowsCount = {changeRowsCount}
                table_ref = {table_ref}
                colID={colID}
                rowID={rowID}
                getColID={getColID}
                getRowID={getRowID}
                dynamicData={dynamicData}
                dynamicHead={dynamicHead}
                getDynamicHead={getDynamicHead}
                getDynamicData={getDynamicData}
                controlData={controlData} 
                renderData={renderData}
                renderHead={renderHead}
                getRenderData={getRenderData} 
                getRenderHead={getRenderHead}
                cellSize={cellSize}
                getCellSize={getCellSize}
            />

            <ConstrolSlider 
                getTrIndex = {getTrIndex}
                getTdIndex = {getTdIndex}
                resizeTableSize = {resizeTableSize}
                lastPickedColor={lastPickedColor}
                getLastPickedColor = {getLastPickedColor}
                getCellMarker_all = {getCellMarker_all}
                defaultStorageData={defaultStorageData}
                historyStorageData={historyStorageData}
                refreshDataFromComponent={refreshDataFromComponent}
                fillInterval_usedCount = {fillInterval_usedCount}
                refreshInterval_usedCount = {refreshInterval_usedCount}
                table_ref = {table_ref}
                switchTemplate = {switchTemplate}
                backToInitialState = {backToInitialState}
                syncBodyStyleToHeader={syncBodyStyleToHeader}
                cellSize={cellSize}
                controlData={controlData} 
                getControlData={getControlData} 
                renderData={renderData}
                renderHead={renderHead}
            />
        </div>
    )
}