import * as React from "react"
import Options from "../Options"
import styles from './index.module.less'

class TextInput extends React.Component {

    state = {
        defaultValue:this.props.defaultValue,
        showOptions:false
    };

    //根据传入的输入类型限制，配置不同的正则
    getInputType = (type) => {
        let reg;
        switch (type) {
            case "number":
                reg = /[^\d]/;
                break;
            case "alphabet":
                reg = /[^\w]/;
                break;
            default:
                break;
        }
        return reg;
    }

    onChange = (e) => {
        const reg = this.getInputType(this.props.inputType);
        let value = e.target.value.replace(reg,"");
        this.setState({
            defaultValue:value
        })
    }

    componentDidUpdate(prevProps){
        if(this.props.defaultValue !== prevProps.defaultValue){
            this.setState({defaultValue:this.props.defaultValue})
        }
    }

    //输入框聚焦
    focus = () =>{
        this.setState({
            showOptions:true
        })
    }

    //输入框失焦后更新数据
    onBlur = (e) => {

        const {max,min} = this.props
        let value = this.state.defaultValue;

        if(this.props.inputType === "number"){
            value =parseInt(value.replace(/[^0-9]/ig,""));
        }

        value = 
            value < min ? min : 
            value > max ? max : value ;

        this.setState({
            defaultValue:value,
            showOptions:false
        })

        if(this.props.resizeTableSize){
            this.props.resizeTableSize(value,this.props.typeName,this.props.propertyName)
        }
        if(this.props.changeFontSize){
            this.props.changeFontSize();
        }

        if(this.props.getValue){
            this.props.getValue(this.props.typeName, this.props.propertyName, value)
        }
    }

    selectOption = (value)=>{
        this.setState({
            defaultValue:value
        })
    }

    render(){
        const {style, placeholder, hasPreInstall, testInputHeight, label, labelDisplay, name, preInstallOptions,readOnly} = this.props;
        const {defaultValue,showOptions} = this.state;

        return (
            <div className={styles["textInput"]} style = {{...style}}>
                {testInputHeight 
                    ?
                    <span
                        type="text" 
                        style={{
                            position:"absolute",
                            fontSize:defaultValue + "px",
                            visibility:"hidden"
                        }}
                    />
                    :
                    null
                }

                <input 
                    type="text" 
                    onChange={!readOnly ? this.onChange : this.nothingChanged} 
                    onFocus={this.focus}
                    onBlur={this.onBlur} 
                    onKeyDown = {(e)=>{
                        if(e.code === "Enter" || e.keyCode === 13){
                            this.onBlur()
                        }
                    }}
                    name={name} 
                    value={defaultValue} 
                    placeholder={placeholder}
                    readOnly = {readOnly}
                />
                {hasPreInstall 
                    ? 
                    <div 
                        className={styles["preInstall"]}
                        style={{display:showOptions?"block":"none"}}>
                        <Options selectOption={this.selectOption} options={preInstallOptions}/>
                    </div>  
                    : 
                    null
                }
                {labelDisplay === "block" 
                    ? 
                    <label style={{display:labelDisplay}}>{label}</label>
                    : 
                    null
                }
                
            </div>
        )
    }
}

export default TextInput;