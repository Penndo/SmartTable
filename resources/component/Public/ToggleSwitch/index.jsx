import * as React from "react"
import styles from './index.module.less'
//示例：https://www.w3schools.com/howto/howto_css_switch.asp

class ToggleSwitch extends React.Component {

    render(){
        const {switchState,changeSwitchState,typeName} = this.props
        return (
            <label className={styles["label"]}>
                <input 
                    type="checkbox" id="interLeave" 
                    onChange = {
                        (event) => {changeSwitchState(typeName,event.target.checked)}
                    } 
                    checked={switchState}/>
                <div className={styles["switch"]}>
                    <div className={styles["dot"]}>
                    </div>
                </div>
                <span>{this.props.label}</span>
            </label>
        )
    }
}

export default ToggleSwitch;