import {mainData} from "../../data/mainData.js";
import {choiseDataBase, clickBackToMain} from "../../supporting/helpFunction.js";
import {showPage} from "../../showPage.js";
import {fieldProject, fieldEmployee, fieldProjectTeam, fieldDelete} from "./fieldInMainBlock.js";
import {fieldChangeTeamLeadInProjectTeam, fieldAddEmployeeInProjectTeam, fieldAddProjectInProjectTeam} from "./fieldInProjectTeam.js";
import {changeProjectTeamInProject, fieldTask, fieldListTask} from "./fieldInView.js";

let order
let buttons = [
    { 
        id : "cancel",
        view:"button", 
        value:"Отменить" ,
        click : clickCancelAndCloseForAll
    },
    { 
        view:"button", 
        value:"Добавить", 
        css:"webix_primary",
        click : clickAddConfirm
    }
]

export function formBlock(o){
    order = o;

    webix.ui({
        id : order.bodyBlockId,
        view: "template"
    }, $$(order.bodyBlockId))

    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    switch(order.dataBody.form){
        case mainData.typeFormEdit:
            buttons[1].value = "Редактировать"
            buttons[1].click = clickEditConfirm
            break
        case mainData.typeFormDelete:
            buttons[1].value = "Уверен"
            buttons[1].click = clickDeleteConfirm
            break
        default:
            buttons[1].value = "Добавить"
            buttons[1].click = clickAddConfirm
    }

    switch(order.dataBody.state){
        case mainData.stateProject:
            fieldProject();
            break;
        case mainData.stateProjectTeam:
            fieldProjectTeam();
            break;
        case mainData.stateEmployee:
            fieldEmployee(order.dataBody.data);
            break;
        case mainData.stateDelete:
            fieldDelete();
            break;
        case mainData.stateChangeTeamLeadInProjectTeam:
            fieldChangeTeamLeadInProjectTeam()
            break;
        case mainData.satefieldAddEmployeeInProjectTeam:
            fieldAddEmployeeInProjectTeam(order.dataBody)
            break
        case mainData.stateFieldAddProjectInProjectTeam:
            fieldAddProjectInProjectTeam()
            break
        case mainData.stateChangeProjectTeamInProject:
            changeProjectTeamInProject()
            break
        case mainData.stateTask:
            fieldTask(order.dataBody)
            break
        case mainData.stateListTask:
            fieldListTask(order)
            break
            
    }
}

export function drawField(data){
    data.elements.push({
        cols: buttons
    })

    webix.ui({
        id : order.bodyBlockId,
        view: "form", 
        rules : data.rules,
        width : data.width ? data.width : 0,
        height : data.height ? data.height : 0,
        elements: data.elements,
    }, $$(order.bodyBlockId))
}

function clickDeleteConfirm(){
    let objActive = order.dataBody.objActive
    let dataBase = choiseDataBase(order.dataBody.dataBase)

    dataBase.remove(objActive.getItem(order.dataBody.data.id), order.dataBody.idInDataBase)
    objActive.remove(order.dataBody.data.id)
    objActive.refresh()

    clickCancelAndCloseForAll()
}

function clickAddConfirm(){
    if(!$$(order.bodyBlockId).validate()){
        webix.message({
            text:"Некорректные данные!",
            type:"error", 
            expire: 2000,
        })
        return;
    }

    choiseDataBase(order.dataBody.dataBase).save($$(order.bodyBlockId).getValues(), order.dataBody.idInDataBase)

    clickCancelAndCloseForAll()
}

function clickEditConfirm(){
    if(!$$(order.bodyBlockId).validate()){
        webix.message({
            text:"Некорректные данные!",
            type:"error", 
            expire: 2000,
        })
        return;
    }

    choiseDataBase(order.dataBody.dataBase)
        .update($$(order.bodyBlockId).getValues(), order.dataBody.idInDataBase)

    clickCancelAndCloseForAll()
}

function clickCancelAndCloseForAll(id){
    if(order.bodyBlockId.includes(mainData.popupBlock)){
        $$(mainData.popupBlock).hide()
        if(id !== "cancel") {
            if (order.dataBody.helpFunction) {
                setTimeout(() => {
                    order.dataBody.helpFunction()
                }, 0);
            }
            prepareActionBeforeClose()
        }
    } else {
        clickBackToMain()
    }
}

function prepareActionBeforeClose(){
    if(order.dataBody.oldOrder){
        showPage(order.dataBody.oldOrder)
        $$(mainData.bodyBlockId).disable();
        webix.extend($$(mainData.bodyBlockId), webix.ProgressBar);
        let delay = 3000
        $$(mainData.bodyBlockId).showProgress({
            type:"top",
            delay: delay,
            hide:true
        });
        setTimeout(function(){
            $$(mainData.bodyBlockId).enable();
        }, delay);
        
    }
}