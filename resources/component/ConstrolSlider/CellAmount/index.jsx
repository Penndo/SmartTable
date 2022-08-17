import * as React from "react"
import styles from './index.module.less'
import TextInput from "../../Public/TextInput"
//示例：https://www.w3schools.com/howto/howto_css_switch.asp

class CellAmount extends React.Component {

    render(){
        const {typeName,getValue,data,resizeTableSize,tableWidth,cellPadding} = this.props;
        let maxColsCount = Math.floor(tableWidth / (Number(cellPadding.b_left*1) + Number(cellPadding.b_right*1) + 8));
        maxColsCount = maxColsCount > 20 ? 20 : maxColsCount;
        //单元格最小宽度 左右padding + 8
        //maxColsCount = Math.floor(width / (paddingLeft + paddingRight))
        return (
            <div>
                <p>{this.props.type}</p>
                <div className={styles["cellAmount"]}>
                    <TextInput inputType = {"number"} defaultValue = {data.cols} labelDisplay={"block"} label = "列数" typeName={typeName} propertyName="cols" readOnly={false}  getValue = {getValue} resizeTableSize = {resizeTableSize} max = {maxColsCount} min = {1}/>
                    <TextInput inputType = {"number"} defaultValue = {data.rows} labelDisplay={"block"} label = "行数" typeName={typeName} propertyName="rows" readOnly={false} getValue = {getValue} resizeTableSize = {resizeTableSize} max = {20} min = {1}/>
                </div>
            </div>
        )
    } 
}

export default CellAmount;