import { useState } from "react";
import {v4 as uuidv4} from "uuid"

//裁切数据，仅保留表格数量的数据大小，若表格数量比已有数据大，那么就要新增表格数量
function shearData(count,data,id,name,updateStatus){
    //右键插入，已经生成了 rowID 和 key ,这里不需要处理了
    if(count <= data.length){
        return data.slice(0,count)
    }else{
        let newly = [];
        let newlyLength = count - data.length;
        for(let i=0,j=1;i<newlyLength;i++,j++){
            let newlyItem = {};
            newlyItem.key = uuidv4();
            newlyItem[name] = id + j;
            newly.push(newlyItem);
        }
        updateStatus(id + newlyLength)
        return data.concat(newly);
    }
}


//同步行&列数据，更新过来的新数据与上一次的数据进行更新交换，数组长度只增加不减少
function sync(preData,newData){
    //删除原来的数据，用空对象占位。
    for(let i=0;i<preData.length;i++){
        preData.splice(i,1,{});
    }
    //在之前删除的位置重新写入 newData 内容。
    for(let i=0;i<newData.length;i++){
        preData.splice(i,1,newData[i]);
    }
}

//计算数组值的总和
function arr_sum(arr) {
    return arr.reduce((acc,cur)=>acc + cur,0)
}

//重新计算列宽度。
function recalculate_CellSize(count,preCount,tableWidth,cellSize,minWidth){
    const cellWidthArr = cellSize.width;
    const width = Math.floor(tableWidth/preCount);
    const changeAmount = count - preCount; //获取长度改变量，>0 是增加列，<0 是减少列。

    let newCellWidthArr=[];//定义新的宽度数组。

    //如果是增加列
    if(changeAmount > 0){
        const increasedCellArr = new Array(changeAmount).fill(width);//要添加的数组
        newCellWidthArr = cellWidthArr.concat(increasedCellArr);//添加了新增数组后的新数组。
    }else{ //如果是减少列
        newCellWidthArr = cellWidthArr.slice(0,count);//重新拷贝一份cols长度的数组
    }

    const sum_NewCellSize = arr_sum(newCellWidthArr);//新数组所有值的和。用于比例的计算;
    
    //计算比例
    let cellSizePercentage = [];//用来存放比例值
    for(let i=0;i<newCellWidthArr.length;i++){
        cellSizePercentage.push(newCellWidthArr[i]/sum_NewCellSize)
    };//通过循环将比例值放入 cellSizePercentage 中

    //为了在改变列的数量时，不让列宽过小，这里需要设置最小列宽
    /* —————————————————————————————————————————————————————————————————— */
    //拆分宽度不够的列，总的差值；宽度富余的列，富余列的总宽；
    let shortIndexArr = [], newCellWidth = [], dif = 0, totalLongWidth = 0;
    for(let i=0;i<cellSizePercentage.length;i++){
        if(Math.floor(cellSizePercentage[i] * tableWidth) <= minWidth){
            shortIndexArr.push(i);
            dif += minWidth - Math.floor(cellSizePercentage[i] * tableWidth)
        }else{
            newCellWidth.push(Math.floor(cellSizePercentage[i] * tableWidth))
            totalLongWidth += Math.floor(cellSizePercentage[i] * tableWidth);
        }
    }

    //计算富余列的比例，并重新计算列宽。
    for(let i=0;i<newCellWidth.length;i++){
        let per = newCellWidth[i]/totalLongWidth;
        newCellWidth[i] = newCellWidth[i] - per*dif;
    }

    //插入 minWidth 到指定位置
    for(let i=0;i<shortIndexArr.length;i++){
        newCellWidth.splice(shortIndexArr[i],0,minWidth)
    }
    /* —————————————————————————————————————————————————————————————————— */

    //因为数据误差这里需要补全，简单处理，用最后一列的宽度吧
    const sum_checkCellWidth = arr_sum(newCellWidth);
    if(sum_checkCellWidth < tableWidth){
        const change = tableWidth - sum_checkCellWidth;//差值
        const lastItemWidth = newCellWidth[newCellWidth.length-1] + change;//修改最后一项的值
        newCellWidth.splice(newCellWidth.length-1,1,lastItemWidth);//替换最后一项
    }

    let newCellSize = {};
    newCellSize.width = newCellWidth;
    return newCellSize;

}

function useShowModal(e) {
    const [selecter, setSelecter] = useState(false);
    const [eventTarget, setEventTarget] = useState(null);

    e.stopPropagation();
    
    if(!selecter){
        setSelecter(true);
        setEventTarget(e.target);
        document.addEventListener("click",hideModal,false)
    }else{
        setSelecter(false);
        document.removeEventListener("click",hideModal,false)
    }
    

    function hideModal(e){
        if(e.target !== eventTarget){
            setSelecter(false);
            document.removeEventListener("click",hideModal,false)
        }
    }
    return selecter
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export {shearData,sync,recalculate_CellSize,useShowModal,debounce}