import * as React from "react"
import TextStyleSetting from "./TextStyle"
import TableBg from "./TableBg"
import CellPaddingSetting from "./CellPadding"
import SwitchButton from "./SwitchButton"
import CellAmount from "./CellAmount"
import ButtonGroup from "./ButtonGroup"
import styles from "./index.module.less"
import TableWidth from "./TableWidth"
import TemplateSelecter from "./TemplateSelecter"

export default function ConstrolSlider(props){
    const {getControlData,renderData,renderHead,controlData,cellSize,syncBodyStyleToHeader,switchTemplate,backToInitialState,table_ref,fillInterval_usedCount,refreshInterval_usedCount,defaultStorageData,historyStorageData,refreshDataFromComponent,lastPickedColor,getLastPickedColor,resizeTableSize,getCellMarker_all,getTdIndex,getTrIndex} = props;
    const {tableWidth, tableAmount, tbodyPadding, theadPadding, theadFill, fill, border, textStyle, theadTextStyle} = controlData;
    const [modalName, setModalName] = React.useState("默认内容");
    const [backToInitial, setBackToInitial] = React.useState(false)

    function getValue(typeName,propertyName,value){

        if(value !== "" && typeName === "fill"){
            getLastPickedColor(value)
        }
        let newData = {}
        if(typeName === propertyName){
            newData = {[typeName]:value}
        }else{
            if(typeName === "border" && border.switchState){
                newData ={
                    [typeName]:{...controlData[typeName],basicColor:value,intervalColor:value}
                }
            }else{
                newData = {
                    [typeName]:{...controlData[typeName],[propertyName]:value}
                };
            }
        }
        getControlData(typeName,newData)
    }

    function changeSwitchState(typeName,state){
        //设置
        if(typeName === "fill"){
            refreshInterval_usedCount(fillInterval_usedCount + 1);
            if(state === true){
                getControlData(null,{
                        fill:{
                            ...controlData["fill"],
                            switchState:true,
                            intervalColor:lastPickedColor
                        },
                        border:{
                            ...controlData["border"],
                            switchState:false,
                            intervalColor:""
                        }
                });
            }else{
                getControlData(null,{
                    fill:{
                        ...controlData["fill"],
                        switchState:false,
                        intervalColor:""
                    }
                })
            }
        }else if(typeName === "border"){
            if(state === true){
                getControlData(null,{
                    fill:{
                        ...controlData["fill"],
                        switchState:false,
                        intervalColor:""
                    },
                    border:{
                        ...controlData["border"],
                        switchState:true,
                        intervalColor:border.basicColor
                    }
                });

            }else{
                getControlData(null,{
                    border:{
                        ...controlData["border"],
                        switchState:false,
                        intervalColor:""
                    }
                });
            }
        }
    }
    
    function getBackToInitial(value) {
        setBackToInitial(value)
    }
    //默认样式给到 tbodyStyle.通过下面 return 查看
    const [styleType, setStyleType] = React.useState("tbodyStyle");

    //控制【表格样式】【表头样式】哪一个显示
    function witchCheck(typeName) {
        setStyleType(typeName);
        //切换 switchButton 如果是 theadStyle 就执行 headStyle() 就是将 表格样式 通过给表头样式那个函数。
        syncBodyStyleToHeader(typeName === "theadStyle")
    }

    function getModalName(value) {
        const modalName = value.trim();
        if(modalName === ""){
            setModalName("自定义")
        }else{
            setModalName(modalName)
        }
    }

    return (
        <div className={styles["constrolSlider"]}>
            <span >

            </span>

            <div className={styles["configureArea"]}>
                <TemplateSelecter 
                    type="选择模板" 
                    getTrIndex = {getTrIndex}
                    getTdIndex = {getTdIndex}
                    backToInitial = {backToInitial} 
                    getBackToInitial={getBackToInitial} 
                    defaultStorageData={defaultStorageData} 
                    historyStorageData={historyStorageData} 
                    switchTemplate={switchTemplate} 
                    backToInitialState={backToInitialState} 
                    refreshDataFromComponent={refreshDataFromComponent} 
                    refreshInterval_usedCount = {refreshInterval_usedCount} 
                    getModalName = {getModalName} 
                    getCellMarker_all={getCellMarker_all}
                />
                <TableWidth type="表格宽度" typeName = "tableWidth" getValue = {getValue}  data = {tableWidth} tableAmount = {tableAmount} tbodyPadding={tbodyPadding} resizeTableSize = {resizeTableSize}/>
                <CellAmount type="表格数量" typeName = "tableAmount" data={tableAmount} tableWidth={tableWidth} cellPadding = {tbodyPadding} resizeTableSize = {resizeTableSize}/>
                {/* <TableData type = "数据源" getControlData = {getControlData} typeName="dataFrom" data={dataFrom}/> */}
                <SwitchButton witchCheck = {witchCheck}  />

                <div className={styles["tbodyStyle"]} style={{display: styleType === "tbodyStyle" ? "block" : "none"}}>
                    <CellPaddingSetting type="padding" typeName="tbodyPadding" area="b" data={tbodyPadding} tableWidth = {tableWidth} tableAmount={tableAmount} getValue = {getValue} resizeTableSize = {resizeTableSize}/>
                    <TableBg type="填充" fillInterval_usedCount={fillInterval_usedCount} toggleLabel="隔行换色" switchColor = {true} switchColorPicker={true} typeName="fill" data={fill} switchState={fill.switchState} changeSwitchState={changeSwitchState}  getValue={getValue}/>
                    <TableBg type="边框" fillInterval_usedCount={fillInterval_usedCount} toggleLabel="列分割线" switchColor = {true} switchColorPicker={false} typeName="border" data={border} switchState={border.switchState} changeSwitchState={changeSwitchState}  getValue={getValue} />
                    <TextStyleSetting type="文本样式" typeName="textStyle" data={textStyle} getValue = {getValue} />
                </div>

                <div className={styles["theadStyle"]} style={{display: styleType === "theadStyle" ? "block" : "none"}}>
                    <CellPaddingSetting type="padding" typeName="theadPadding" area="h" data={theadPadding} tableWidth = {tableWidth} tableAmount={tableAmount} getValue = {getValue} resizeTableSize = {resizeTableSize}/>
                    <TableBg type="填充" switchColor = {false} typeName="theadFill" data={theadFill} getValue={getValue}/>
                    <TextStyleSetting type="文本样式" typeName="theadTextStyle" data={theadTextStyle} getValue = {getValue}/>
                </div>

            </div>

            <div className={styles["buttonGroup"]}>
                    <ButtonGroup table_ref={table_ref} refreshDataFromComponent={refreshDataFromComponent} getBackToInitial={getBackToInitial} renderHead={renderHead} renderData={renderData} controlData={controlData} cellSize={cellSize} modalName = {modalName}/>
            </div>

        </div>
    )
}