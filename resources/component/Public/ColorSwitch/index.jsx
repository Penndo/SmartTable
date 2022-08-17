import * as React from "react"
import ColorPicker from "../ColorPicker"
import ToggleSwitch from "../ToggleSwitch"
import styles from "./index.module.less"

class ColorSwitch extends React.Component {
    
    render(){

        const {toggleLabel, switchColorPicker, getValue, typeName, propertyName,changeSwitchState,switchState,defaultColor} = this.props;

        return (
            <div className={styles["switchGroup"]}>
            
                <ToggleSwitch 
                    label={toggleLabel} 
                    changeSwitchState={changeSwitchState} 
                    typeName={typeName} 
                    switchState={switchState}
                />

                {
                    switchColorPicker && switchState ?
                    <ColorPicker 
                        key={this.props.fillInterval_usedCount} 
                        style={{ width: 24, height: 24, marginLeft: 8}} 
                        defaultColor={defaultColor} 
                        typeName={typeName} 
                        propertyName={propertyName} 
                        getValue={getValue} 
                    /> 
                    : null
                }
                
            </div>
        )
    }
}

export default ColorSwitch;