import * as React from "react"
import TextInput from "../../Public/TextInput";

class TableWidth extends React.Component {
    render(){
        const {getValue,typeName,resizeTableSize,tableAmount,tbodyPadding} = this.props;
        let minWidth =Math.ceil(tableAmount.cols * (Number(tbodyPadding.b_left) + Number(tbodyPadding.b_right) + 8));
        return (
            <div>
                <p>{this.props.type}</p>
                <TextInput inputType = {"number"} defaultValue = {this.props.data} typeName = {typeName} propertyName = "tableWidth" labelDisplay = "none" readOnly={false} getValue = {getValue} resizeTableSize={resizeTableSize} max={3200} min={minWidth}/>
            </div>
        )
    }
}

export default TableWidth;