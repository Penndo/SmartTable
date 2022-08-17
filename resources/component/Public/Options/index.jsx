import * as React from "react";
import {createIDB, deleteItem, getAllValue, update} from "../IDB";
import ToolTips from "../ToolTips";
import {v4 as uuidv4} from "uuid";

import styles from "./index.module.less";

const defaultStoreName = "defaultStore";
const historyStoreName = "historyStore";

class Options extends React.Component{

    handleClick = (e)=>{
        const value = e.currentTarget.innerHTML;
        this.props.selectOptionValue(value)
    }

    deleteData = (keyValue,refreshDataFromComponent)=>{
        return ()=>{
            createIDB().then((db)=>{
                //从默认库中删除数据；
                deleteItem(db,defaultStoreName,keyValue);
                //从历史库中更新/删除数据；如果默认库中已经没有数据了，那么就删除。如果还有那么就更新为第一项的数据
                getAllValue(db,defaultStoreName).then((result)=>{
                    if(result.length){
                        const keyValue = result[result.length-1].title;
                        update(db,historyStoreName,{id:1,history:keyValue});
                        this.props.selectOptionValue(keyValue);
                        refreshDataFromComponent();
                    }else{
                        deleteItem(db,historyStoreName,1);
                        this.props.backToInitialState();
                        this.props.selectOptionValue("")
                    }
                });
                
            })
        }

    }

    render(){
        const {options,refreshDataFromComponent} = this.props;
        return(
            <ul className={styles.ul}>
                {
                    options.map((item)=>{
                        return (
                            <li key={uuidv4()} >
                                <p onMouseDown = {this.handleClick}>{item}</p>
                                {
                                    <div className={styles["closePart"]}>
                                        <p onClick={this.deleteData(item,refreshDataFromComponent)}>删除模板</p>
                                        <div className={styles["toolTips"]}>
                                            <ToolTips  tips="删除模板" />
                                        </div>
                                    </div>
                                }
                            </li>
                        ) 
                    })
                }
            </ul>
        )

    }
}

export default Options;