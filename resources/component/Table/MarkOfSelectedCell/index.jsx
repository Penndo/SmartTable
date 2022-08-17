import * as React from "react"

class MarkOfSelectedCell extends React.Component {
    style = {
        width:this.props.width,
        height:this.props.height
    }
    render(){
        return(
            <div
                style={{...this.style,
                    border:"1px solid #000000"
                }}>
                    
                </div>
        )
    }
}

export default MarkOfSelectedCell;