import * as React from "react"
import styles from './index.module.less'
import TextInput from "../../Public/TextInput"

class CellPaddingSetting extends React.Component {

    render(){
        const {type, area, data, typeName, getValue,resizeTableSize, tableWidth, tableAmount} = this.props;
        let maxPadding_right = Math.floor(tableWidth / tableAmount.cols) - data.b_left - 8;
        let maxPadding_left = Math.floor(tableWidth / tableAmount.cols) - data.b_right - 8;
        return (
            <div>
                <p>{type}</p>
                {
                    typeName === "tbodyPadding"
                    ? 
                    <div className={styles["cellPadding"]+" "+styles["bodyPadding"]}>
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_left"]} typeName = {typeName} propertyName={area+"_left"} label = "left" readOnly={false} getValue={getValue} max = {maxPadding_left} min = {0}/>
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_top"]} typeName = {typeName} propertyName={area+"_top"} label = "top" readOnly={false} getValue={getValue} resizeTableSize = {resizeTableSize} max={120} min={0}/>
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_right"]} typeName = {typeName} propertyName={area+"_right"} label = "right" readOnly={false} getValue={getValue} max = {maxPadding_right} min = {0}/> 
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_bottom"]} typeName = {typeName} propertyName={area+"_bottom"} label = "bottom" readOnly={false} getValue={getValue} resizeTableSize = {resizeTableSize} max={120} min={0}/>
                    </div>
                    :  
                    <div className={styles["cellPadding"]+" "+styles["headPadding"]}>
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_top"]} typeName = {typeName} propertyName={area+"_top"} label = "top" readOnly={false} getValue={getValue} resizeTableSize = {resizeTableSize} max={120} min={0}/>
                        <TextInput inputType = {"number"} labelDisplay={"block"} defaultValue = {data[area+"_bottom"]} typeName = {typeName} propertyName={area+"_bottom"} label = "bottom" readOnly={false} getValue={getValue} resizeTableSize = {resizeTableSize} max={120} min={0}/>
                    </div>}
            </div>
        )
    }
}

export default CellPaddingSetting;