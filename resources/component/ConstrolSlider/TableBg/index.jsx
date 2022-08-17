import * as React from "react";
import ColorPicker from "../../Public/ColorPicker";
import ColorSwitch from "../../Public/ColorSwitch";
import styles from "./index.module.less";


class TableBg extends React.Component {

    render(){
        const {toggleLabel, switchColor, switchColorPicker, type, typeName, data, getValue, changeSwitchState, switchState, fillInterval_usedCount} = this.props;
        return(
            <div>
                <p>{type}</p>
                <div className={styles["stork"]}>
                    
                    {/*填充色 边框色*/}
                    <div>
                        <ColorPicker style={{ width: 62, height: 24}} defaultColor={data.basicColor} propertyName = "basicColor" typeName={typeName} getValue={getValue}/>
                        <label>颜色</label>
                    </div>

                    {/*隔行换色 分割线颜色*/}
                    {
                        switchColor ? 
                        <ColorSwitch 
                            fillInterval_usedCount={fillInterval_usedCount}
                            typeName = {typeName}
                            propertyName = "intervalColor" 
                            defaultColor = {data.intervalColor}
                            toggleLabel={toggleLabel} 
                            switchState = {switchState}
                            switchColorPicker={switchColorPicker} 
                            getValue={getValue} 
                            changeSwitchState={changeSwitchState} 
                        />:
                        null
                    }
                </div>
            </div>
        )
    }
}

export default TableBg;

