import * as React from "react"
import * as IDB from "../IDB"
import styles from "./index.module.less"
import Button from "../Button"

const defaultStoreName = "defaultStore";
const defaultHistoryName = "historyStore";

function createModal(modalName,storageData,refreshDataFromComponent) {
    IDB.createIDB().then((db)=>{

        if(modalName.trim() !== ""){
            IDB.getAllValue(db,defaultStoreName).then(
                function(result){
                    let isHave = 0;
                    for(let i=0;i<result.length;i++){
                        if(result[i].title === modalName){
                            isHave = 1;
                        }
                    }
                    
                    // 如果数据库中还不存在该数据。
                    if(!isHave){
                        var data = {};
                        data.title = modalName;
                        data.information = storageData;
                        //添加数据到数据库
                        IDB.add(db,defaultStoreName,data);
                        //更新最后选择
                        IDB.update(db,defaultHistoryName,{id:1,history:modalName});
                        refreshDataFromComponent();
    
                    }else{
                        alert(`已经存在 “${modalName}” 了，请重新输入`)
                    }
                }
            )
        }else{
            alert("title不能为空")
        }
    })
}

class Modal extends React.Component {

    state = {
        inputValue:"",
    }

    onchange = (e)=>{
        this.setState({
            inputValue:e.target.value,
        })
    }

    newTemplate = (modalName,storageData,setTemplatePopState,refreshDataFromComponent) => {
        storageData.cellSize = this.props.recalculateCellSize(storageData.cellSize)
        createModal(modalName,storageData,refreshDataFromComponent);
        setTemplatePopState();

    }

    render(){
        const {storageData, refreshDataFromComponent, setTemplatePopState} = this.props
        const {inputValue} = this.state;
        return(
            <div className={styles["dialog"]}>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={this.onchange} 
                    placeholder="请输入模板名" 
                    autoFocus 
                    onKeyDown={(e)=>{
                        if(e.code === "Enter"){
                            this.newTemplate(inputValue,storageData,setTemplatePopState,refreshDataFromComponent)
                        }
                    }}
                />
                <Button label="取消" type = "secondary" func = {setTemplatePopState}/>
                <Button label="确定" func = {()=>{this.newTemplate(inputValue,storageData,setTemplatePopState,refreshDataFromComponent)}}/>
            </div>
        )
    }
}

export default Modal;