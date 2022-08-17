import {v4 as uuidv4} from "uuid";

const originControlData = {
    tableWidth:"640",
    tableAmount:{
        cols:"4",
        rows:"4"
    },
    tbodyPadding:{
        b_top:"12",
        b_right:"16",
        b_bottom:"12",
        b_left:"16"
    },
    theadPadding:{
        h_top:"12",
        h_bottom:"12"
    },
    fill:{
        basicColor:"rgba(255,255,255,1)",
        switchState:false,
        intervalColor:""
    },
    border:{
        basicColor:"rgba(237,237,237,1)",
        switchState:true,
        intervalColor:"rgba(237,237,237,1)"
    },
    theadFill:{
        basicColor:"rgba(245,245,245,1)"
    },
    textStyle:{
        basicColor:"rgba(51,51,51,1)",
        fontSize:"14",
        fontWeight:"regular"
    },
    theadTextStyle:{
        basicColor:"rgba(51,51,51,1)",
        fontSize:"14",
        fontWeight:"bold"
    }
}

const originCellSize = {
    height:[40,40,40,40,40],
    width:[160,160,160,160]
}

//初始表头数据及格式
const originHead = function () {
    return(
        [
            {serialNumber:"0",colID:1,title:"A",key:uuidv4()},
            {serialNumber:"1",colID:2,title:"B",key:uuidv4()},
            {serialNumber:"2",colID:3,title:"C",key:uuidv4()},
            {serialNumber:"3",colID:4,title:"D",key:uuidv4()}
        ]
    )
}

//初始表格数据及格式
const originData = function () {
    return(
        [
            {rowID:1,1:"",2:"",3:"",4:"",key:uuidv4()},
            {rowID:2,1:"",2:"",3:"",4:"",key:uuidv4()},
            {rowID:3,1:"",2:"",3:"",4:"",key:uuidv4()},
            {rowID:4,1:"",2:"",3:"",4:"",key:uuidv4()}
        ]
    )
}

const initialCellMarker = {
    offsetLeft:-100,
    offsetTop:-100,
    offsetWidth:0,
    offsetHeight:0
}

export {originControlData, originCellSize, originHead, originData, initialCellMarker};