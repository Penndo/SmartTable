import React from 'react';
import SketchPicker from 'react-color/lib/Sketch';

import styles from './index.module.less';

class ColorPicker extends React.Component {

    state = {
        isVisable:false,
    }

    hexToRgb = (hex) => {
        if(hex.indexOf("#") === 0){
            return (
                {
                    r:parseInt("0x" + hex.slice(1,3)),
                    g:parseInt("0x" + hex.slice(3,5)),
                    b:parseInt("0x" + hex.slice(5,7)),
                    a:1
                }
            )
        }else{
            return hex
        }
    }

    toRgba = (obj) => {
        if(typeof obj === "object"){
            return(
                `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`
            )
        }else{
            return obj
        }
    }

    changeColor = (color) => {
        const {typeName,propertyName} = this.props;
        this.props.getValue(typeName,propertyName,this.toRgba(color.rgb))
    }

    //给sketchpicker的包裹层加一个 click 事件，用来阻止事件冒泡。
    //因为给 document 添加点击事件。所以，在点击色板的时候事件也会冒泡的 document 上面去，导致色板被隐藏。因此我们在色板上加一个 stopPropagation 就可以防止 document 上的事件被触发。
    sketchPickerHandle = (e) => {
        e.stopPropagation();
    }

    hiddenSketchPicker = (e) => {
        if(e.target !== this.state.corlorPickerTarget){
            this.setState({isVisable:false})
            document.removeEventListener("click",this.hiddenSketchPicker)
        }
    }   
    
    showSketchPicker = (e) => {
        const {isVisable} = this.state;
        if(isVisable === false){
            //点击的时候 创建一个 colorPickerTarget 状态，可以看见原始状态是没有这个的。状态毕竟只是一个对象，可以自由的增删。这在某些不知如果定义初始值的时候非常有用。
            this.setState({isVisable:!isVisable,corlorPickerTarget:e.currentTarget})
            document.addEventListener("click",this.hiddenSketchPicker)
        }else if(isVisable === true){
            this.setState({isVisable:!isVisable})
            document.removeEventListener("click",this.hiddenSketchPicker)
        }
    }
    
    render() {
        const {style,defaultColor} = this.props;
        const {isVisable} = this.state;
        return (
            <div className={styles["colorPicker"]}>
                <div 
                    className = {styles['trigger-wrapper']} 
                    style={{
                            ...style,
                        }}
                >
                    <div
                        title={'点击修改颜色'}
                        className={styles['color-picker-trigger']}
                        onClick = {this.showSketchPicker}
                        style={{
                            width:style.width-6,
                            height:style.height-6,
                            backgroundColor: this.toRgba(this.hexToRgb(defaultColor))
                        }}
                    ></div>
                </div>
                {
                    isVisable ? 
                    <div 
                        onClick = {this.sketchPickerHandle}
                        style = {{position:"absolute",right:0,bottom:28,zIndex:100}}
                    >
                        <SketchPicker
                            color={this.hexToRgb(defaultColor)}
                            onChange={this.changeColor}
                            // width={252}
                        />
                    </div>
                    : null
                }
            </div>

        );
    }
}

export default ColorPicker;
