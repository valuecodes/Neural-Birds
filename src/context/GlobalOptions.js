import React,{ createContext,useReducer } from 'react'
import AppReducer from './AppReducer'

const initialOptions={
    options:{
        closingRate:5000,
        gapWidth:120,
        hardness:20,
        population:10,
        speed:1,
        pipeRate:140,
        choiceRate:55,
        poolSize:10,
        mutateRate:10,
        selectionPower:1,
        recreateRate:100,
        neuralNetwork:[
            {type:'Input',neuralsCount:5,id:0,neurals:[
                {id:1,name:'1'},
                {id:2,name:'2'},
                {id:3,name:'3'},
                {id:4,name:'4'},
                {id:5,name:'5'},
            ]},
            {type:'Hidden',neuralsCount:8,id:1,neurals:[
                {id:1,name:'1'},
                {id:2,name:'2'},
                {id:3,name:'3'},
                {id:4,name:'4'},
                {id:5,name:'5'},
                {id:6,name:'6'},
                {id:7,name:'7'},
                {id:8,name:'8'},
            ]},
            {type:'Output',neuralsCount:2,id:2,neurals:[
                {id:1,name:'1'},
                {id:2,name:'2'},
            ]},
        ]
    }
}

export const GlobalOptions = createContext(initialOptions);

export const GlobalOptionsProvider=({children})=>{

    const [state,dispatch]= useReducer(AppReducer,initialOptions);

    const modifyOptions=(value,optionName)=>{
        let newValue=value;
        if(!isNaN(newValue))newValue=Number(newValue)
        let modifiedOptions={...state.options};
        modifiedOptions[optionName]=newValue;
        dispatch({
            type:'MODIFY_OPTIONS',
            payload:{
                data:modifiedOptions
            },
        })  
    }

    return (<GlobalOptions.Provider
        value={{
            options:state.options,
            modifyOptions,
        }}
       >
           {children}
       </GlobalOptions.Provider>)
} 
