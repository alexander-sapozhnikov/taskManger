import {mainData, Order} from "../data/mainData.js";
import {getHeaderIdForThisPage, choiseDataBase,
    defineStateThroughTitleHeaderOrId} from "../supporting/helpFunction.js";
import {showPage} from "../showPage.js";

let order

export function mainBlock(o){
    order = o;
    webix.ui({
        view:"dataview",
        id: order.bodyBlockId,
        select: true,
        xCount : 6,
        width : 0,
        type: {
            height: 150,
            width: "auto",
            template:  getTemplate,
        },
        data : [],

        onClick : {
            "deleteBtn" : clickDeleteItem,
            "addBtn" : clickAddNewComponentInMainBlock,
            "editBtm" : clickEditItem,
        },

        on: {
            onSelectChange : clickOnItem
        },
    }, $$(order.bodyBlockId))


    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });


    let dataBase = choiseDataBase(order.dataBody.dataBase)

    dataBase.getAll()
        .then( response => {
                    if(!response.data){
                        response.data = []
                    }
                    response.data.push({addNew: true})
                    $$(order.bodyBlockId).parse(response.data);
                    $$(order.bodyBlockId).refresh();
                    $$(order.bodyBlockId).enable();
                    $$(order.bodyBlockId).hideProgress();
        })


}


function getTemplate(data){
    let template =  "<div style='position: relative; display: flex; flex-direction: column; justify-content: center; height: 100%'>"

    if(data.addNew){
        return "<div class='addBtn' style='display: flex; justify-content: center; flex-direction: column; height: 100%;'> " +
            "<i class='far fa-plus-square'  style = 'font-size : 70px; text-align: center; margin: 0 auto; '></i>" +
            "<p style='text-align: center; margin: 0'>" +  mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())+ "</p>"+
            "</div>"
    }


    switch(order.dataBody.state){
        case mainData.stateProject:
            template += "<p style='text-align: center; margin: 0; font-size: 10px; height: 18px;'> проект:</p>"
                + "<p style='text-align: center; margin: 0; font-size: 24px; word-break: break-all;'>" + data.nameProject + "</p>"
                if(data.projectTeam.nameProjectTeam)
                    template += "<p style='text-align: center; margin: 0; font-size: 10px; height: 18px;'> команда:</p>"
                    + "<p style='text-align: center; margin: 0'>" + data.projectTeam.nameProjectTeam + "</p>"
            break
        case mainData.stateProjectTeam:
            template += "<span class='editBtm fas fa-edit' style = ' font-size : 20px; cursor: pointer; position: absolute; right: 22px; top: 0;'></span>"
                +"<p style='text-align: center; margin: 0; font-size: 20px; word-break: break-all;'>" + data.nameProjectTeam + "</p>"
            break
        case mainData.stateEmployee:
            template += "<p style='text-align: center; margin: 0; font-size: 18px'>" + data.firstName +"<br/>" +  data.middleName + "<br/>" + data.lastName + "<br/>" + "</p>"
            break
    }

    template += "<span class='deleteBtn fas fa-trash' style = ' font-size : 20px; cursor: pointer; position: absolute; right: 0; top: 0;'></span> </div>"
    return template
}

function clickAddNewComponentInMainBlock(){
    let order = new Order(false, mainData.titleAndBackHeader, mainData.formBody);

    order.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
    }

    order.dataBody = {
        state : defineStateThroughTitleHeaderOrId(),
        dataBase : defineStateThroughTitleHeaderOrId()
    }

    showPage(order)
    return false
}

 function clickDeleteItem(_, id){
        let order = new Order(true, mainData.justTitleHeader, mainData.formBody)
        order.dataHeader = {
             headerTitle : mainData.headerTitleMap.get(getHeaderIdForThisPage()),
             innerHeaderTitle : mainData.wordDelete + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
        }
        order.dataBody = {
            state : mainData.stateDelete,
            form  : mainData.typeFormDelete,
            data : $$(mainData.bodyBlockId).getItem(id),
            objActive : $$(mainData.bodyBlockId),
            dataBase : defineStateThroughTitleHeaderOrId()
        }
        showPage(order)
        return false
}

function clickEditItem(_, id){
    let order = new Order(false, mainData.titleAndBackHeader, mainData.editProjectTeamBody);

    order.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : $$(mainData.bodyBlockId).getItem(id).nameProjectTeam
    }

    order.dataBody = {
        data : $$(mainData.bodyBlockId).getItem(id),
    }

    showPage(order)
    return false
}

function clickOnItem(id){
    if(order.dataBody.state === mainData.stateEmployee){
        let order = new Order(false, mainData.titleAndBackHeader, mainData.formBody);

        order.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue(),
            innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(getHeaderIdForThisPage())
        }

        order.dataBody = {
            state : defineStateThroughTitleHeaderOrId(),
            form : mainData.typeFormEdit,
            data : this.getItem(id),
            dataBase : defineStateThroughTitleHeaderOrId(),
            idInDataBase : $$(mainData.bodyBlockId).getItem(id).idEmployee
        }

        showPage(order)
    } else if (order.dataBody.state === mainData.stateProject){
        let newOrder = new Order(false, mainData.titleAndBackHeader, mainData.viewBoardBody);

        newOrder.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue(),
            innerHeaderTitle : "Проект : " + this.getItem(id).nameProject
        }

        newOrder.dataBody = {
            data : this.getItem(id),
        }
        showPage(newOrder)
    } else {
        let newOrder = new Order(false, mainData.titleAndBackHeader, mainData.viewActionEmployeesBody);

        newOrder.dataHeader = {
            headerTitle : $$(mainData.headerTitleId).getValue(),
            innerHeaderTitle : "Проектная команда : " + this.getItem(id).nameProjectTeam
        }

        newOrder.dataBody = {
            data : this.getItem(id),
        }
        showPage(newOrder)
    }
}
