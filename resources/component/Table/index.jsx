import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TableEdit from "./TableEdit";
import TableCell from "./TableCell";
import { initialCellMarker } from "../Public/originContant";

import styles from "./index.module.less"

export default function Table(props) {

    const {controlData,cellSize,colID,rowID,getColID,getRowID,renderHead,renderData, getCellSize, getRenderData, getRenderHead,getDynamicHead,getDynamicData,table_ref,changeColsCount,changeRowsCount,
        trIndex,tdIndex,lastSelectedTdIndex,lastSelectedTrIndex,cellMarker_all,getTrIndex,getTdIndex,getLastSelectedTrIndex,getLastSelectedTdIndex,getCellMarker_all
    } = props;
    const {b_top,b_right,b_bottom,b_left} = controlData.tbodyPadding;
    const {h_top,h_bottom} = controlData.theadPadding;
    const tableWidth = controlData.tableWidth;
    const reservedWidth = (b_left*1 + b_right*1) + "px";
    
    const [rightPanelState, setRightPanelState] = useState({
        display:false
    });

    const rightPanel = useRef(null);
    const cellMarker = useRef(null);
    const [dragSelectCells,setDragSelectCells] = useState(false);

    function getDragSelectCells(value) {
        return (
            setDragSelectCells(value)
        )
    }
    //获取当前事件的位置
    function eventPosition(e) {

        let currentTd = e.target.tagName === "TD" || e.target.tagName === "TH" ? e.target : e.target.parentNode;
        let currentTr = currentTd.parentNode;

        let cols = currentTr.childNodes
        let rows = table_ref.current.rows;

        let tdIndex = Array.from(cols).indexOf(currentTd);
        let trIndex = Array.from(rows).indexOf(currentTr);
       
        return {"tdIndex":tdIndex,"trIndex":trIndex}
    }

    function clearSelectedCells(e) {
        let newRenderHead = renderHead.slice();
        let newRenderData = renderData.slice();

        let minTdIndex = Math.min(tdIndex,lastSelectedTdIndex);
        let minTrIndex = Math.min(trIndex,lastSelectedTrIndex);

        let rowLoopTimes = Math.abs(trIndex-lastSelectedTrIndex) + 1;
        let colLoopTimes = Math.abs(tdIndex-lastSelectedTdIndex) + 1;

        if(minTrIndex === 0){ //表头参与
            //更新表头数据
            for(let k=0;k<colLoopTimes;k++){
                newRenderHead[minTdIndex+k]["title"] = ""
            }
            // 更新表格数据
            for(let j=0;j<rowLoopTimes-1;j++){
                for(let k=0;k<colLoopTimes;k++){
                    newRenderData[j][newRenderHead[minTdIndex + k]["colID"]] = ""
                }
            }
        }else{ //表头不参与
            for(let j=0;j<rowLoopTimes;j++){
                for(let k=0;k<colLoopTimes;k++){
                    newRenderData[minTrIndex+j-1][newRenderHead[minTdIndex + k]["colID"]] = ""
                }
            }
        }
        getRenderHead(newRenderHead);
        getRenderData(newRenderData);

    }

    function cut(e) {
        e.preventDefault()
        copy(e);
        clearSelectedCells(e)
    }

    function copy(e) {
        e.preventDefault()
        let newRenderHead = renderHead.slice();
        let newRenderData = renderData.slice();

        let minTdIndex = Math.min(tdIndex,lastSelectedTdIndex);
        let minTrIndex = Math.min(trIndex,lastSelectedTrIndex);

        let rowLoopTimes = Math.abs(trIndex-lastSelectedTrIndex) + 1;
        let colLoopTimes = Math.abs(tdIndex-lastSelectedTdIndex) + 1;

        let data = "";

        if(minTrIndex === 0){ //表头参与
            //更新表头数据
            for(let k=0;k<colLoopTimes;k++){
                data += newRenderHead[minTdIndex+k]["title"] + (k === colLoopTimes - 1 ? "" : "\t")
            }
            data = data + "\n"
            // 更新表格数据
            for(let j=0;j<rowLoopTimes-1;j++){
                for(let k=0;k<colLoopTimes;k++){
                    data += newRenderData[j][newRenderHead[minTdIndex + k]["colID"]] + (k === colLoopTimes - 1 ? "" : "\t")
                }
                data += "\n"
            }
        }else{ //表头不参与
            for(let j=0;j<rowLoopTimes;j++){
                for(let k=0;k<colLoopTimes;k++){
                    data += newRenderData[minTrIndex+j-1][newRenderHead[minTdIndex + k]["colID"]] + (k === colLoopTimes - 1 ? "" : "\t")
                }
                data += "\n"
            }
        }

        e.clipboardData.setData("text/plain",data)
    }

    function clipboard(e,inputStyleName) {
        if(inputStyleName === "focusInput") return;
        e.preventDefault();
        let newRenderHead = renderHead.slice();
        let newRenderData = renderData.slice();

        let minTdIndex = Math.min(tdIndex,lastSelectedTdIndex);
        let minTrIndex = Math.min(trIndex,lastSelectedTrIndex);
        let maxTdIndex = Math.max(tdIndex,lastSelectedTdIndex);
        let maxTrIndex = Math.max(trIndex,lastSelectedTrIndex);

        let rows = controlData.tableAmount.rows;
        let cols = controlData.tableAmount.cols;
        let copiedRow = [];
        let copiedTable = [];

        navigator.clipboard.readText().then(
            (clipText) => {
                copiedRow = clipText.split("\n").filter(word => word !== "");
                for(let i=0;i<copiedRow.length;i++){
                    copiedTable.push(copiedRow[i].split("\t"));
                }

                let textRows = copiedRow.length;
                let textCols = copiedTable[0].length;

                //如果数据量小于框选范围，数据将重复出现，以覆盖框选范围
                let rowLoopTimes,colLoopTimes;
                const trDif = maxTrIndex - minTrIndex + 1 - textRows;
                const tdDif = maxTdIndex - minTdIndex + 1 - textCols;
                
                if(trDif > 0){
                    const concatData = copiedTable.slice();//复制一份用来添加的数据
                    let addTimes = Math.ceil(trDif/textRows);
                    for(let i=0;i<addTimes;i++){
                        copiedTable = copiedTable.concat(concatData)
                    }
                    rowLoopTimes = maxTrIndex - minTrIndex + 1
                }else {
                    rowLoopTimes = Math.min(textRows,rows-minTrIndex+1); //因为这里的 rows 数量不包含表头，所以要 +1
                }

                if(tdDif >0){
                    const concatData = copiedTable.slice();//复制一份用来添加的数据，行和列需要重新引用，才能获取到最新的 copiedTable
                    let addTimes = Math.ceil(tdDif/textCols);
                    for(let i=0;i<copiedTable.length;i++){
                        for(let j=0;j<addTimes;j++){
                            copiedTable[i] = copiedTable[i].concat(concatData[i])
                        }
                    }
                    colLoopTimes = maxTdIndex - minTdIndex + 1
                }else{
                    colLoopTimes = Math.min(textCols,cols-minTdIndex);
                }
                
                if(minTrIndex === 0){ //表头参与
                    //更新表头数据
                    for(let k=0;k<colLoopTimes;k++){
                        newRenderHead[minTdIndex+k]["title"] = copiedTable[0][k]
                    }
                    //更新表格数据
                    for(let j=0;j<rowLoopTimes-1;j++){
                        for(let k=0;k<colLoopTimes;k++){
                            newRenderData[j][newRenderHead[minTdIndex + k]["colID"]] = copiedTable[j+1][k]
                        }
                    }
                }else{ //表头不参与
                    for(let j=0;j<rowLoopTimes;j++){
                        for(let k=0;k<colLoopTimes;k++){
                            newRenderData[minTrIndex+j-1][newRenderHead[minTdIndex + k]["colID"]] = copiedTable[j][k]
                        }
                    }
                }
                getRenderHead(newRenderHead);
                getRenderData(newRenderData);
            }
        );
    }


    useEffect(()=>{
        if(trIndex !== null && tdIndex !== null){

            const firstRows = table_ref.current.rows[trIndex];
            const lastRows = table_ref.current.rows[lastSelectedTrIndex];

            let firstCell = undefined, lastCell=undefined;
            if(firstRows !== undefined && lastRows !== undefined){
                firstCell = Array.from(firstRows.childNodes)[tdIndex];
                lastCell =  Array.from(lastRows.childNodes)[lastSelectedTdIndex];
            }

            if(firstCell !== undefined && lastCell !== undefined){
                
                const firstTop = firstCell.offsetTop;
                const firstLeft = firstCell.offsetLeft;
                const firstWidth = firstCell.offsetWidth;
                const firstHeight = firstCell.offsetHeight;
    
                const lastTop = lastCell.offsetTop;
                const lastLeft = lastCell.offsetLeft;
                const lastWidth = lastCell.offsetWidth;
                const lastHeight = lastCell.offsetHeight;
    
                const originX = lastLeft >= firstLeft ? firstLeft : lastLeft;
                const originY = lastTop >= firstTop ? firstTop : lastTop;
                const width = lastLeft >= firstLeft ? Math.abs(lastLeft - firstLeft) + lastWidth : Math.abs(lastLeft - firstLeft) + firstWidth;
                const height = lastTop >= firstTop ? Math.abs(lastTop - firstTop) + lastHeight : Math.abs(lastTop - firstTop) + firstHeight;
    
                getCellMarker_all({            
                    offsetTop:originY,
                    offsetLeft:originX,
                    offsetWidth:width,
                    offsetHeight:height
                });
            }
        }else {
            getCellMarker_all(initialCellMarker);
        }
    },[table_ref,trIndex,tdIndex,lastSelectedTdIndex,lastSelectedTrIndex,getCellMarker_all,controlData.tableWidth,controlData.tbodyPadding,controlData.theadPadding,controlData.tableAmount,controlData.textStyle.fontSize,cellSize])

    function changeTbodyValue(e) {
        const {trIndex,tdIndex} = eventPosition(e);
        let insert = renderData.slice();
        insert[trIndex-1][renderHead[tdIndex]["colID"]] = e.target.value;
        getRenderData(insert);
        getDynamicData(insert);
    }

    function changeTheadValue(e){
        const {tdIndex} = eventPosition(e);
        let insertHead = renderHead.slice();
        insertHead[tdIndex]["title"] = e.target.value;
        getRenderHead(insertHead);
        getDynamicHead(insertHead)
    }
    
    //自定义右键菜单
    function forRight(e) {
        e.preventDefault();
        const {trIndex,tdIndex} = eventPosition(e);

        let winHeight = window.innerHeight;

        let rightPanelHeight = 0;
        if(trIndex === 0){
            rightPanelHeight = 176;
        }else {
            rightPanelHeight = 336
        }

        setRightPanelState({
            display:true,
            area:e.target
        })
        //获取当前鼠标的坐标
        const clickX = e.clientX
        const clickY = e.clientY

        //为 右键菜单 标记了 refs 标签 (rightPanel)。这里引用并设置右键菜单的位置
        //（已经设置 ul 的 position 为 absolute ）。
        rightPanel.current.style.left = clickX + 2 + "px"
        if(clickY + rightPanelHeight > winHeight){
            rightPanel.current.style.top = winHeight - rightPanelHeight + "px"
        }else{
            rightPanel.current.style.top = clickY + "px"
        }

        //更新当前事件的位置
        getTdIndex(tdIndex)
        getTrIndex(trIndex)
        //为 document 添加一个全局点击事件，用来隐藏右键菜单
        document.addEventListener("click",handleDocument)
    }

    //隐藏右键
    function handleDocument(){
        setRightPanelState({
            display:false
        })
        //隐藏后移除全局事件。
        document.removeEventListener("click",handleDocument)
    }

    //增减行
    function changeRow(how){
        return function() {
            let insert = renderData.slice()
            switch (how) {
                case "after":
                    insert.splice(trIndex, 0, {key:uuidv4(),rowID:rowID+1});
                    getTrIndex(trIndex + 1);
                    getLastSelectedTrIndex(trIndex + 1)
                    break;
                case "front":
                    insert.splice(trIndex-1, 0, {key:uuidv4(),rowID:rowID+1});
                    break;
                case "remove":
                    insert.splice(trIndex-1, 1)
                    break;
                default:
                    break;
            }
            changeRowsCount(insert.length,renderHead,insert);
            setRightPanelState({
                display:false
            });
            getRowID(rowID + 1);
        }
    }

    //增减列
    function changeCol(how){
        return function(){
            let insert = renderHead.slice();
            switch (how) {
                case "after":
                    insert.splice(tdIndex + 1, 0, {key:uuidv4(),colID:colID+1});
                    getTdIndex(tdIndex + 1)
                    getLastSelectedTdIndex(tdIndex + 1)
                    break;
                case "front":
                    insert.splice(tdIndex, 0, {key:uuidv4(),colID:colID+1});
                    break;
                case "remove":
                    insert.splice(tdIndex, 1);
                    break;
                default:
                    break;
            }
            changeColsCount(insert.length,insert,renderData);
            setRightPanelState({
                display:false
            });
            getColID(colID + 1)
        }
    }

    //复制行
    function duplicateRow(){
        return function() {
            let insert = renderData.slice();
            let copiedRow = insert[trIndex-1];
            let keyWords = {
                key:uuidv4(),rowID:rowID+1
            };
            let merged = {...copiedRow,...keyWords};
            insert.splice(trIndex, 0, merged);
            changeRowsCount(insert.length,renderHead,insert)
            setRightPanelState({
                display:false
            });
            getRowID(rowID + 1);
            getTrIndex(trIndex+1);
            getLastSelectedTrIndex(trIndex+1);
        }
    }

    //复制列
    function duplicateCol(){
        return function(){
            let insert_Head = renderHead.slice();
            let insert_Data = renderData.slice();
            let copiedTitle = insert_Head[tdIndex].title;
            let newColID = colID + 1;

            insert_Head.splice(tdIndex + 1, 0, {title:copiedTitle,key:uuidv4(),colID:newColID});
            insert_Data.forEach((obj)=>{
                obj[newColID] = obj[insert_Head[tdIndex].colID]
            });

            changeColsCount(insert_Head.length,insert_Head,insert_Data)
            setRightPanelState({
                display:false
            });
            getColID(colID + 1);
            getTdIndex(tdIndex + 1);
            getLastSelectedTdIndex(tdIndex + 1);
        }
    }

    //清空行
    function clearRow(){
        return function() {
            let insert = renderData.slice();
            let willClearRow = insert[trIndex-1];

            for(let property in willClearRow){
                if(property !== "key" && property !== rowID){
                    insert[trIndex-1][property] = ""
                }
            };
            changeRowsCount(insert.length,renderHead,insert)
            setRightPanelState({
                display:false
            });
        }
    }

    //清空列
    function clearCol(){
        return function() {
            let insert_Head = renderHead.slice();
            let insert_Data = renderData.slice();

            insert_Head[tdIndex].title = "";
            insert_Data.forEach((obj)=>{
                obj[insert_Head[tdIndex].colID] = ""
            });

            changeColsCount(insert_Head.length,insert_Head,insert_Data)
            setRightPanelState({
                display:false
            });
        }
    }

    //定义表格可拖动的原始值
    const [draggableCells, setDraggableCells] = useState({
        variableCellWidthArr:[],
        oldCellWidthArr:[],
        currentCellWidth:"",
        draggable:false,
        mousePositon:"",
        indexOfCurrentCell:""
    });
    
    //给一个初始的单元格宽度，表格宽度除以表头数量然后取整。
    const defaultCellWidth = Math.floor(tableWidth / renderHead.length);

    function onMouseIn(event) {
        if(event.target.tagName === "LI"){
            //获取鼠标按下获取到的那个元素
            let current = event.target;
            //获取 thead 中的所有子元素
            let lists = current.parentNode.childNodes;
            //将获取的 thead 中的所有子元素放入数组
            let listsArr = Array.from(lists);
            //更新状态
            setDraggableCells({
                ...draggableCells,
                variableCellWidthArr:listsArr,
            });
        }
    }

    //鼠标按下的时候
    function onMouseDown(event){
        if(event.target.tagName === "LI"){
            //获取鼠标按下获取到的那个元素
            let current = event.target;
            //获取 thead 中的所有子元素
            let lists = current.parentNode.childNodes;
            //将获取的 thead 中的所有子元素放入数组
            let listsArr = Array.from(lists);
            //获取当前单元格的序号
            let mouseDownCurrentIndex = listsArr.indexOf(current);

            //更新状态
            setDraggableCells({
                ...draggableCells,
                variableCellWidthArr:listsArr,
            });

            //如果不是最后一个单元格，且鼠标位置在单元格右侧侧 8 像素范围内
            if(mouseDownCurrentIndex !== listsArr.length-1 && event.nativeEvent.offsetX > current.offsetWidth - 8){
                
                //鼠标手势变为拖动手势
                current.style.cursor = "col-resize";
                
                //记录之前的单元格宽度
                let oldCellWidthArr = [];
                for(let i=0;i<listsArr.length;i++){
                    oldCellWidthArr.push(listsArr[i].offsetWidth)
                }
                
                //更新状态
                setDraggableCells({
                    variableCellWidthArr:listsArr,
                    oldCellWidthArr:oldCellWidthArr,
                    currentCellWidth:current.offsetWidth,
                    draggable:true,
                    mousePositon:event.clientX,
                    indexOfCurrentCell:mouseDownCurrentIndex,
                });
            }
        }
    }

    //鼠标移动的时候
    function onMouseMove(event){
        let current, lists, listsArr, currentIndex;
        if(event.target.tagName === "LI"){
            current = event.target
            lists = current.parentNode.childNodes;
            listsArr = Array.from(lists)
            currentIndex = listsArr.indexOf(current);
            
            //同样的要去检测鼠标位置以及他的事件对象
            if(currentIndex !== listsArr.length-1 && event.nativeEvent.offsetX > current.offsetWidth - 8){
                current.style.cursor = "col-resize";
            }else{
                current.style.cursor = "default";
            }            
        }

        //鼠标按下的时候已经将表格的拖动状态设置为 true
        if(draggableCells.draggable === true){

            const minWidth = Number(b_left) + Number(b_right) + 8;
            const currentIndex = draggableCells.indexOfCurrentCell;
            const currentWidth = draggableCells.currentCellWidth;
            const variableWidthArr = draggableCells.variableCellWidthArr;


            //x的变量等于当前鼠标的 offsetX 减去 mouseDown 时初次获取的鼠标位置
            const deltaX = event.clientX - draggableCells.mousePositon;
            
            //有多少个需要改变宽度的单元格? 需要改变宽度的单元格数量是鼠标事件序号之后的所有单元格
            const deltaCount = variableWidthArr.length - currentIndex - 1;

            //基础增量，每一个单元格增加的量：deltaX 减去 除不净（deltaX % 要改变宽度的单元格数量）的量，然后再除以要改变宽度的单元格数量。
            const cellDeltaX = (deltaX - deltaX % deltaCount)/deltaCount;

            function maxCellWidth(i) {
                return(
                    tableWidth - draggableCells.oldCellWidthArr.slice(0,i).reduce((a,b)=>a+b,0) - (draggableCells.oldCellWidthArr.length - 1 - i)*minWidth
                )
            }

            for(let i=0;i<variableWidthArr.length;i++){
                    
                    if(i < currentIndex){
                        variableWidthArr[i].style.width = draggableCells.oldCellWidthArr[i] + "px" //如果小于 左右padding + 8 就不再减小了。
                    }else if(i === currentIndex){
                        let width;
                        if(currentWidth + deltaX > maxCellWidth(i) && deltaX > 0){
                            width = maxCellWidth(i);
                            onMouseUp(event);
                        }else if(currentWidth + deltaX < minWidth && deltaX < 0){
                            width = minWidth;
                            onMouseUp(event);
                        }else{
                            width = currentWidth + deltaX;
                        }
                        variableWidthArr[i].style.width = width + "px";
                    }else if(i === currentIndex + 1){
                        let width;
                        if(draggableCells.oldCellWidthArr[i] - cellDeltaX - deltaX % deltaCount < minWidth && deltaX > 0){
                            width = minWidth;
                        }else{
                            width = draggableCells.oldCellWidthArr[i] - cellDeltaX - deltaX % deltaCount;
                        }
                        variableWidthArr[i].style.width = width + "px"
                    }else{
                        let width;
                        if(draggableCells.oldCellWidthArr[i] - cellDeltaX < minWidth){
                            width = minWidth;
                        }else{
                            width = draggableCells.oldCellWidthArr[i] - cellDeltaX;
                        }
                        variableWidthArr[i].style.width = width + "px"
                    }
            }    
        }
    }

    function onMouseOut(event) {
        if(event.target.tagName === "LI"){
            onMouseUp(event)
        }
    }
    
    function onMouseUp(event){
        const variableWidthArr = draggableCells.variableCellWidthArr
        if(event.target.tagName === "LI"){
            setDraggableCells({...draggableCells,draggable:false});
            event.target.style.cursor = "default";
            let newstWidthArr = [];
            let newstHeightArr = [];
            let cellSize = {};
        
            for(let i=0;i<variableWidthArr.length;i++){
                newstWidthArr.push(variableWidthArr[i].offsetWidth)
                newstHeightArr.push(variableWidthArr[i].offsetHeight*1)
            }
            
            cellSize.width = newstWidthArr;
            cellSize.height = newstHeightArr;
            getCellSize(cellSize);
        }
    }

    function fontWeight(value){
        let fontWeight;
        switch (value) {
            case "light":
                fontWeight = 200
                break;
            case "regular":
                fontWeight = 400;
                break;
            case "bold":
                fontWeight = 600;
                break;
            default:
                break;
        }
        return fontWeight
    }

    return (
        <div className={styles.leftPart}
            onClick = {
                (e)=>{
                    //node.contains(otherNode) 判断某个元素是否包含其他元素
                    if(!table_ref.current.contains(e.target) && e.target.tagName !== "LI"){
                        getCellMarker_all(initialCellMarker);
                        getTdIndex(null);
                        getTrIndex(null);
                    }
                }
            }
        >
            <div className={styles.rightPanel} ref={rightPanel} onContextMenu={(e)=>{e.preventDefault()}} >
                {
                    rightPanelState.display ?
                    <TableEdit 
                        trIndex = {trIndex}
                        addRowOnTop={changeRow("front")} 
                        addRowOnBottom={changeRow("after")}
                        addColLeft={changeCol("front")}
                        addColRight={changeCol("after")}
                        removeCurrentRow={changeRow("remove")}
                        removeCurrentCol={changeCol("remove")}
                        duplicateRow = {duplicateRow()}
                        duplicateCol = {duplicateCol()}
                        clearRow = {clearRow()}
                        clearCol = {clearCol()}
                    />:
                    null
                }
            </div> 
            <ul 
                style={{
                    width:cellSize.width.reduce((a,b)=>a+b,0),
                }}
                onMouseEnter = {onMouseIn}
                onMouseDown = {onMouseDown}
                onMouseMove = {onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave = {onMouseOut}
                className={styles.colID}
            >
                {renderHead.map((cell,index)=>{
                    return (
                        <li 
                            key = {cell["key"] + "li"}
                            style = {{
                                width:cellSize.width.length ? cellSize.width[index] : defaultCellWidth,
                            }}
                        >
                            {cell["serialNumber"]*1 + 1}
                        </li>
                    )
                })}
            </ul>
            <div className={styles.tableContainer} >
                <input
                    ref = {cellMarker}
                    disabled = {true}
                    onKeyDown={(e)=>{
                        if(e.code === "Backspace"){
                            clearSelectedCells(e)
                        }else if(e.shiftKey === true || e.altKey === true || e.ctrlKey === true || e.metaKey === true){
                            return;
                        }else{
                            e.preventDefault()
                        }
                    }}
                    onCopy = {copy}
                    onCut = {cut}
                    onPaste={(e)=>{clipboard(e,"input")}}
                    className={styles.mark} 
                    style={{
                        left:cellMarker_all.offsetLeft + "px",
                        top:cellMarker_all.offsetTop + "px",
                        width:cellMarker_all.offsetWidth + "px",
                        height:cellMarker_all.offsetHeight + "px",
                    }}
                >

                </input>
                <table
                    ref = {table_ref}
                    style={{
                        width:cellSize.width.reduce((a,b)=>a+b,0)
                    }}
                >
                    <colgroup>
                        {renderHead.map(()=>{
                            return (<col key={uuidv4()}></col>) 
                        })}
                    </colgroup>
                    <thead>
                        <tr>
                            {renderHead.map((cell,index) => {
                                const cellStyle = {
                                    outline:"none",
                                    width:cellSize.width.length ? cellSize.width[index] : defaultCellWidth,
                                    backgroundColor:controlData.theadFill.basicColor,
                                    borderRight:controlData.border.intervalColor !== "" && index !== renderHead.length-1 ? `1px solid ${controlData.border.intervalColor}`: "none",
                                    borderBottom:`1px solid ${controlData.border.basicColor}`
                                }
                                const inputStyle = {
                                    width:`calc(100% - ${reservedWidth})`,
                                    color:controlData.theadTextStyle.basicColor,
                                    WebkitTextFillColor:controlData.theadTextStyle.basicColor,
                                    fontSize:controlData.theadTextStyle.fontSize+ "px",
                                    fontWeight:fontWeight(controlData.theadTextStyle.fontWeight),
                                    marginTop:h_top + "px",
                                    marginRight:b_right + "px",
                                    marginBottom:h_bottom + "px" ,
                                    marginLeft:b_left + "px",
                                    padding:0
                                }
                                return (
                                    <TableCell
                                        cellMarker = {cellMarker}
                                        value = {cell["title"]}
                                        cellStyle = {cellStyle}
                                        inputStyle = {inputStyle}
                                        table_ref = {table_ref}
                                        eventPosition = {eventPosition}
                                        clipboard = {clipboard}
                                        forRight = {forRight}
                                        renderHead = {renderHead}
                                        renderData = {renderData}
                                        changeValue = {changeTheadValue}
                                        dragSelectCells = {dragSelectCells}
                                        getDragSelectCells = {getDragSelectCells} 
                                        trIndex = {trIndex}
                                        tdIndex = {tdIndex}
                                        getTdIndex = {getTdIndex}
                                        getTrIndex = {getTrIndex}
                                        getLastSelectedTdIndex = {getLastSelectedTdIndex}
                                        getLastSelectedTrIndex = {getLastSelectedTrIndex}
                                        key={cell["key"]}
                                    />
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {renderData.map((perObject,rowIndex) => {
                            return (
                                <tr key={perObject["key"]}>
                                    {renderHead.map((cell,cellIndex) => {
                                        const cellStyle = {
                                            backgroundColor:controlData.fill.intervalColor !== "" && rowIndex%2 === 0 ? controlData.fill.intervalColor : controlData.fill.basicColor,
                                            borderRight:controlData.border.intervalColor !== "" && cellIndex !== renderHead.length-1 ? `1px solid ${controlData.border.intervalColor}`: "none",
                                            borderBottom:`1px solid ${controlData.border.basicColor}`
                                        }
                                        const inputStyle = {
                                            width:`calc(100% - ${reservedWidth})`,
                                            color:controlData.textStyle.basicColor,
                                            WebkitTextFillColor:controlData.textStyle.basicColor,
                                            fontSize:controlData.textStyle.fontSize+"px",
                                            fontWeight:fontWeight(controlData.textStyle.fontWeight),
                                            marginTop:b_top+"px",
                                            marginRight:b_right+"px",
                                            marginBottom:b_bottom+"px",
                                            marginLeft:b_left+"px",
                                        }
                                        return (
                                            <TableCell
                                                cellMarker = {cellMarker}
                                                value = {perObject[cell["colID"]]}
                                                cellStyle = {cellStyle}
                                                inputStyle = {inputStyle}
                                                table_ref = {table_ref}
                                                eventPosition = {eventPosition}
                                                clipboard = {clipboard}
                                                forRight = {forRight}
                                                renderHead = {renderHead}
                                                renderData = {renderData}
                                                changeValue = {changeTbodyValue}
                                                dragSelectCells = {dragSelectCells}
                                                getDragSelectCells = {getDragSelectCells} 
                                                trIndex = {trIndex}
                                                tdIndex = {tdIndex}
                                                getTdIndex = {getTdIndex}
                                                getTrIndex = {getTrIndex}
                                                lastSelectedTdIndex = {lastSelectedTdIndex}
                                                lastSelectedTrIndex = {lastSelectedTrIndex}
                                                getLastSelectedTdIndex = {getLastSelectedTdIndex}
                                                getLastSelectedTrIndex = {getLastSelectedTrIndex}
                                                key={perObject["key"]+cell["key"]}
                                            />
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}