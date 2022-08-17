import * as React from "react"
import styles from "./index.module.less"

//示例：https://www.w3schools.com/howto/howto_css_switch.asp

class switchButton extends React.Component {

    state = {
        interLeaveChecked: "tbodyStyle"
    }

    handleCheck = (e) => {
        const name = e.currentTarget.name
        this.setState({
            interLeaveChecked:name
        });
        this.props.witchCheck(name)
    }

    render(){
        return(
            <div>
                <div className={styles["radio"]}>
                
                    <input type="radio" id="big" className={styles["big"]} name="tbodyStyle" onChange={this.handleCheck} checked={this.state.interLeaveChecked === "tbodyStyle"}/>
                    <label htmlFor="big">表格样式</label>
            
                    <input type="radio" id="normal" className={styles["normal"]} name="theadStyle" onChange={this.handleCheck} checked={this.state.interLeaveChecked === "theadStyle"} />
                    <label htmlFor="normal">表头样式</label>
          
                    <div className={styles["selectedBg"]}></div>  
                </div>            
            </div>
        )
    }
}

export default switchButton;