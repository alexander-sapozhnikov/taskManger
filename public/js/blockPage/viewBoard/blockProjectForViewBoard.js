import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {deleteEmployeeFromTasks} from "../../supporting/helpFunction.js";

let projectTeam
let order
export function blockProjectTeam(pt, o){
    projectTeam = pt
    order = o
    webix.ui({
        rows : [
            {
                align : "center",
                view:"label",
                label : "Team Lead: ",
            },
            {
                align : "center",
                view:"label",
                label : projectTeam.teamLead.firstName + " " + projectTeam.teamLead.lastName,
            },
            {
                align : "center",
                view:"label",
                label : "Сотрудники: ",
            },
            {
                view : "list",
                template : "#firstName#  #lastName#",
                select : true,
                data: projectTeam.employees
            },
            {
                view: "button",
                template: "<div class='flexBox'>" +
                    "<p style=' margin: auto'><i class='fas fa-exchange-alt' ></i> Сменить команду </p>" +
                    "</div>",
                height : 35,
                on:{
                    onItemClick: clickChangeProjectTeam
                }
            },
        ],
    }, $$("blockProjectTeam"))
}

function clickChangeProjectTeam(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordEdit + " проектную группу"
    }

    newOrder.dataBody = {
        state : mainData.stateChangeProjectTeamInProject,
        form : mainData.typeFormEdit,
        dataBase : mainData.stateProject,
        idInDataBase : order.dataBody.data.idProject,
        oldOrder : order,
        helpFunction : resetTaskForOtherProjectTeam
    }

    showPage(newOrder)
}

function resetTaskForOtherProjectTeam(){
    projectTeam.employees.forEach(employee => {
        deleteEmployeeFromTasks(employee, order.dataBody.data.idProject)
    })
}