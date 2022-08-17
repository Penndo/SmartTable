import * as React from "react"
import styles from "./index.module.less"

class ToolTips extends React.Component {


    render(){

        const {tips} = this.props;

        return (
            <div className={styles["div"]}>
                {tips}
            </div>
        )
    }
};

export default ToolTips;