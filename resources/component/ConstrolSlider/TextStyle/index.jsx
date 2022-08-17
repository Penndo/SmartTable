import * as React from "react"
import ColorPicker from "../../Public/ColorPicker";
import TextInput from "../../Public/TextInput";
import styles from "./index.module.less"

//示例：https://www.w3schools.com/howto/howto_css_switch.asp

class TextStyleSetting extends React.Component {
    render(){
        const {type,typeName,getValue,data} = this.props;
        return(
            <div>
                <p>{type}</p>
                <div className={styles["fontStyle"]}>
                    <div>
                        <ColorPicker style={{ width: 62, height: 24}} defaultColor={data.basicColor} typeName={typeName} propertyName="basicColor" getValue={getValue}/>
                        <label>颜色</label>
                    </div>
                    <TextInput style={{width:62}} labelDisplay={"block"} hasPreInstall={true} preInstallOptions={[12,14,16,20]} readOnly={true} label = "字号" defaultValue={data.fontSize} typeName={typeName} propertyName="fontSize" inputType="number"  getValue={getValue} />
                    <TextInput style={{width:132}} labelDisplay={"block"} hasPreInstall={true} preInstallOptions={["light", "regular", "bold"]} readOnly={false} label = "字重" defaultValue={data.fontWeight} typeName={typeName} propertyName="fontWeight"  getValue={getValue}/>
                </div>
            </div>
        )
    }
}

export default TextStyleSetting;