import * as React from "react"
import Button from "../../Public/Button";
import Modal from "../../Public/Modal";
import styles from './index.module.less'

class ButtonGroup extends React.Component {

    state = {
        templatePop:false
    }

    setTemplatePopState = (e)=>{
        this.setState({
            templatePop:!this.state.templatePop
        });
        this.props.getBackToInitial(false)
    }

    recalculateCellSize = (cellSize)=>{
        const tableRows = this.props.table_ref.current.rows;
        let newCellSize = {};
        let newHeight = [];
        for(let i=0;i<tableRows.length;i++){
            newHeight.push(tableRows[i].offsetHeight)
        };
        newCellSize.width = cellSize.width;
        newCellSize.height = newHeight;

        return newCellSize;
    }

    //点击确定的时候传递数据
    transData = (renderHead,renderData,controlData,cellSize,modalName) => {
        return ()=>{
            const newCellSize = this.recalculateCellSize(cellSize)
            postMessage('insert',renderHead,renderData,controlData,newCellSize,modalName);
            // console.log(renderHead,renderData,controlData,newCellSize,modalName);
        }
    }
    //点击取消的时候需要关闭窗口
    
    render(){
        const {templatePop} = this.state;
        const {renderHead,renderData,controlData,cellSize,refreshDataFromComponent,modalName} = this.props;

        const storageData = {
            renderHead:renderHead,
            renderData:renderData,
            controlData:controlData,
            cellSize:cellSize
        }

        return (
            <div style={{position:"relative"}}>
                {templatePop  ? 
                    <Modal table_ref={this.props.table_ref} recalculateCellSize = {this.recalculateCellSize} refreshDataFromComponent={refreshDataFromComponent} storageData={storageData} setTemplatePopState = {this.setTemplatePopState}  />
                    :   
                    <div className = {styles["buttonGroup"]} >
                        <Button label = "创建为模板" type = "secondary" func = {this.setTemplatePopState}/>
                        <Button label = "生成表格" func={this.transData(renderHead,renderData,controlData,cellSize,modalName)}/>
                    </div>
                }
            </div>
        )
    }
}

export default ButtonGroup;