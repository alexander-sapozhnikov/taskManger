import {mainData} from "../data/mainData.js";
import {clickBackToMain, getHeaderIdForThisPage} from "../supporting/helpFunction.js";

const HeightHeaderDynamic = 50
let order

export function blockHeader(o){
    order = o
    
    setHeadTitleAndMenuImg();

    switch(order.typeHeader){
        case mainData.searchHeader: 
            drawSearch();
            break;
        case mainData.titleAndBackHeader: 
            drawTitleAndBack();
            break;
        case mainData.justTitleHeader: 
            drawJustTitle();
            break;
    }
}

function setHeadTitleAndMenuImg(){
    let oldValueElement = $$(mainData.headerTitleId).getValue();
    
    if(order.dataHeader.headerTitle 
        && oldValueElement !== order.dataHeader.headerTitle){
        $$(mainData.headerTitleId).setValue(order.dataHeader.headerTitle)

        let oldHeaderId = mainData.employeeHeaderId

        mainData.headerTitleMap.forEach((value, key) => {
            if(value === oldValueElement) {
                oldHeaderId = key
                return 
            }
        });

        let newHeaderId = getHeaderIdForThisPage();

        if(newHeaderId !== oldHeaderId){
            $$(oldHeaderId).define("image", mainData.pathToImg
                    + mainData.ImgMenuMap.get(oldHeaderId)
                    + mainData.png);
            $$(oldHeaderId).refresh();

            $$(newHeaderId).define("image", mainData.pathToImg
                    + mainData.ImgMenuMap.get(newHeaderId)
                    + mainData.active
                    + mainData.png);
            $$(newHeaderId).refresh();
        }
    }
}

function drawSearch(){
    webix.ui({
        id : order.headerBlockId,
        css:"webix_light searchHeader",
        height : HeightHeaderDynamic,
        view:"search", 
        placeholder:"Искать..", 
        value: "",
        label:"Поиск",

    }, $$(order.headerBlockId))

    $$(order.headerBlockId).attachEvent("onTimedKeyPress",function(){
        let value = this.getValue().toLowerCase();
        $$(mainData.bodyBlockId).filter(function(obj){
            if(!obj.addNew) {
                return Object.values(obj).join("").toLowerCase().indexOf(value) > -1;
            } else return value === "";
        })
    });
}

function drawTitleAndBack(){
    webix.ui({
        id : order.headerBlockId,
        height : HeightHeaderDynamic,
        cols :[
            {
                view:"label",
                label: "<i class='fas fa-backward' style='cursor: pointer; font-size: 45px; margin-left: 8px; color: #475466'></i>",
                width : 80,
                align:"left",
                on: {
                    onItemClick : clickBackToMain,
                },
            },
            {
                id : "titleForm",
                align:"center",
                view:"label", 
                label : "",
            },
            {
                width : 80,
            },
        ]
    }, $$(order.headerBlockId))

    $$("titleForm").setValue(order.dataHeader.innerHeaderTitle)
}

function drawJustTitle(){
    webix.ui({
        id : order.headerBlockId,
        cols :[
            {
                id : "justTitleForm",
                align:"center",
                view:"label", 
                value : "",
            }
        ]
    }, $$(order.headerBlockId))

    $$("justTitleForm").setValue(order.dataHeader.innerHeaderTitle)

}