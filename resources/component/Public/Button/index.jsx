import * as React from "react"
import './index.module.less'

class Button extends React.Component {

    render(){
        const {label,type,customStyle,func} = this.props
        //主按钮样式
        const primaryStyle = {
            boxShadow: "0 2px 6px 0 rgba(33,0,107,0.10), 0 6px 16px 0 rgba(33,0,107,0.08), 0 12px 20px 0 rgba(33,0,107,0.06)",
            color: "white",
            backgroundImage: "linear-gradient(180deg, #8C49FF 0%, #5F23FF 100%),linear-gradient(180deg, #7C33FE 0%, #3B00D9 100%)",
        }
        //次按钮样式
        const secondaryStyle = {
            boxShadow: "0 2px 6px 0 rgba(140,140,140,0.08), 0 6px 16px 0 rgba(140,139,139,0.06), 0 12px 20px 0 rgba(140,140,140,0.04)",
            color: "#626872",
            backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%),linear-gradient(180deg, #F0F0F0 0%, #E6E6E6 100%)",
        }

        let style;
        switch (type) {
            case "primary":
                style = primaryStyle;
                break;
            case "secondary":
                style = secondaryStyle;
                break;
            default :
                style = primaryStyle;
                break;
        }

        return (
            <button
                style= {{...style,...customStyle}}
                onClick = {func}
            >
                {label}
            </button>
        )
    }
}

export default Button;