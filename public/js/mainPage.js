import {mainData, Order} from "./data/mainData.js";
import {showPage} from "./showPage.js";
import {defineStateThroughTitleHeaderOrId} from "./supporting/helpFunction.js";


export function drawMainPage(){
    webix.ui({
        id : "mainPage",
        rows:[
            {
                view:"toolbar",
                css:"webix_dark",
                height : 70,
                cols:[
                    {
                        view:"label",
                        width : 200,
                        label:"<p style='margin: 0; font-size: 25px'>Task manager</p>"
                    },
                    {
                        id: mainData.headerTitleId,
                        align:"center",
                        view:"label",
                        css : "mainText",
                        label : "",
                    },
                    {
                        width : 220,
                        cols : [
                            {
                                view:"button",
                                id : mainData.projectHeaderId,
                                css : "webix_transparent",
                                type: "image",
                                image: mainData.pathToImg + mainData.ImgMenuMap.get(mainData.projectHeaderId) + mainData.png,
                                click : clickToMenu
                            },
                            {
                                view:"button",
                                css : "webix_transparent",
                                id : mainData.projectTeamHeaderId,
                                type: "image",
                                image:  mainData.pathToImg + mainData.ImgMenuMap.get(mainData.projectTeamHeaderId) + mainData.png,
                                click : clickToMenu
                            },
                            {
                                view:"button",
                                css : "webix_transparent",
                                id : mainData.employeeHeaderId,
                                type: "image",
                                image:  mainData.pathToImg + mainData.ImgMenuMap.get(mainData.employeeHeaderId) +  mainData.active + mainData.png,
                                click : clickToMenu
                            }
                        ]
                    }
                ]
            },

            {
                id : mainData.headerBlockId,
            },



            {
                id: mainData.bodyBlockId,
            }
        ]
    }, $$("mainPage"))

    let order = new Order(false, mainData.searchHeader, mainData.mainBody)
    order.dataHeader = { headerTitle : mainData.headerTitleMap.get(mainData.projectHeaderId)}
    order.dataBody = {
        state : mainData.stateProject,
        dataBase : mainData.stateProject
    }
    showPage(order)
}


function clickToMenu(id){
    let order = new Order(false, mainData.searchHeader, mainData.mainBody)

    order.dataHeader = {
        headerTitle : mainData.headerTitleMap.get(id)
    }

    order.dataBody = {
        state : defineStateThroughTitleHeaderOrId(id),
        dataBase : defineStateThroughTitleHeaderOrId(id)
    }

    showPage(order)
}


let popup = {
    view:"popup",
    id:"Popup",
    position:"center",
    body:{
        width: "auto",
        height: "auto",
        rows:[
            { 
                id : (mainData.headerBlockId + mainData.popupBlock),   
            },
            {
                id:  (mainData.bodyBlockId + mainData.popupBlock),
            }
        ]
    }
}

webix.ui(popup).hide();
