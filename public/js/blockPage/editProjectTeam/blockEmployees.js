import {employeeData} from "../../data/employeeData.js";
import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {idEmployeeBlock, clickDeleteItem, order} from "./editProjectTeamBlock.js";

export function blockEmployee(){
    webix.extend($$(idEmployeeBlock), webix.ProgressBar);
    $$(idEmployeeBlock).showProgress({
        type:"icon",
        hide : false
    });
    $$(idEmployeeBlock).disable()

    employeeData.getByProjectTeam(order.dataBody.data)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            response.data.push({addNew: true})
            drawBlockEmployee(response)
        })
}

function drawBlockEmployee(employees){
    webix.ui({
        id : idEmployeeBlock,
        view:"dataview",
        select:false,
        xCount:7,
        height: 0,
        type: {
            width:"auto",
            height: 150,
            template: getTemplateEmployee,
        },
        data: employees,
        onClick : {
            "deleteBtn" : clickDeleteItem,
            "addBtn" : clickAddEmployee,
        },
    }, $$(idEmployeeBlock))
}

function getTemplateEmployee(data){
    if(data.addNew){
        return "<div class='addBtn' style='display: flex; justify-content: center; flex-direction: column; height: 100%;'> " +
            "<i class='far fa-plus-square'  style = ' font-size : 60px; text-align: center; margin: 0 auto;'></i>" +
            "<p style='text-align: center; margin-top: 0'>сотрудника</p>"+
            "</div>"
    } else {
        return "<div style='position: relative; display: flex; flex-direction: column; justify-content: center; height: 100%'> <p style='text-align: center'>"+
            data.firstName +"<br/>"
            +  data.middleName+ "<br/>"
            + data.lastName + "</p>"
            + "<span class='deleteBtn fas fa-trash' style = ' font-size : 20px; cursor: pointer; position: absolute; right: 0; top: 0;'></span> "
            + "</div>"
    }
}

function clickAddEmployee(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(mainData.employeeHeaderId)
    }

    newOrder.dataBody = {
        state : mainData.satefieldAddEmployeeInProjectTeam,
        dataBase : mainData.stateProjectTeam,
        form : mainData.typeFormEdit,
        data : order.dataBody.data,
        objActive : this,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : blockEmployee
    }

    showPage(newOrder)
}
