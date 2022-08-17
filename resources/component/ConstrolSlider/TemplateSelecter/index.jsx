import * as React from "react";
import {createIDB,update} from "../../Public/IDB"
import styles from './index.module.less';
import Options from "../../Public/Options";
import { initialCellMarker } from "../../Public/originContant";
import Button from "../../Public/Button";

const defaultHistoryName = "historyStore";
// const defaultSelection = "默认内容"

class TemplateSelecter extends React.Component {

    state={
        //选择框默认值为历史选择数据中的 history
        inputValue:this.props.historyStorageData.length ? this.props.historyStorageData[0].history : "",
        //下拉选项是否开启
        selecter:false,
        eventTarget:""
    }

    //props 更新后 更新 state
    componentDidUpdate(prevProps){
        if(this.props.historyStorageData !== prevProps.historyStorageData && !this.props.backToInitial){
            if(this.props.historyStorageData.length){
                this.setState({inputValue:this.props.historyStorageData[0].history})
            }else{
                this.setState({inputValue:""})
            }
        }
    }

    //显示&隐藏弹窗
    showModal = (e) => {
        e.stopPropagation();
        const {selecter} = this.state;
        if(!selecter){
            this.setState({
                selecter:true,
                eventTarget:e.target
            })
            document.addEventListener("click",this.hideModal,false)
        }else{
            this.setState({
                selecter:false
            })
            document.removeEventListener("click",this.hideModal,false)
        }
    }

    hideModal = (e) => {
        const {eventTarget} = this.state
        if(e.target !== eventTarget){
            this.setState({
                selecter:false
            })
            document.removeEventListener("click",this.hideModal,false)
        }
    }

    //设置输入框的值显示
    setInputValue = (value)=>{
        this.setState({
            inputValue:value,
            selecter:false
        });

        this.props.getModalName(value);

        if(value !== this.state.inputValue){
            this.props.getCellMarker_all(initialCellMarker);
            this.props.getTrIndex(null);
            this.props.getTdIndex(null)
        }

        if(value === "") return;

        createIDB().then((db)=>{
            //更新历史选择数据
            update(db,defaultHistoryName,{id:1,history:value});
        });
        //从模板更新数据，关键字是这个 value
        this.props.switchTemplate(value);

    }

    render(){
        const {defaultStorageData, refreshDataFromComponent, backToInitialState, refreshInterval_usedCount} = this.props
        const {selecter,inputValue} = this.state;
        //获取defaultStorageData 中所有的 title 值，也就是选项
        let options = [];
        for(let i=0;i<defaultStorageData.length;i++){
            options.push(defaultStorageData[i].title);
        }

        let placeholder = options.length ? "请选择" : "暂无模板，请创建"

        return (
            <div className={styles["selecter"]}>
                <p>{this.props.type}</p>
                <div>
                    <input type="text" onClick={this.showModal}  placeholder={placeholder} value={inputValue} readOnly></input>
                    <Button 
                        label = "恢复默认" 
                        type = "secondary" 
                        customStyle = {{
                            height:"25px",
                            width:"120px",
                            fontSize:"12px",
                            borderRadius:"6px",
                            boxShadow:"null",
                            border: "1px solid rgb(216, 216, 216)",
                        }} 
                        func = {()=>{
                            this.setInputValue("")
                            this.props.getBackToInitial(true)
                            this.props.refreshInterval_usedCount(1);
                            backToInitialState();
                        }}

                    />
                </div>
                {
                    //选项值长度为 0 时不渲染下拉组件
                    defaultStorageData.length ? 
                    <div className={styles["preInstall"]} style={{display:selecter ? "block" : "none"}}>
                        <Options 
                            backToInitialState={backToInitialState} 
                            options ={options} 
                            refreshDataFromComponent={refreshDataFromComponent} 
                            selectOptionValue={this.setInputValue} 
                            refreshInterval_usedCount = {refreshInterval_usedCount}
                        />
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default TemplateSelecter;



