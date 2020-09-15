import {projectTeamData} from "../../data/projectTeamData.js";
import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {projectData} from "../../data/projectData.js";
import {deleteEmployeeFromTasks} from "../../supporting/helpFunction.js";
import {order} from "./editProjectTeamBlock.js";

export function blockTeamLead(){
    webix.extend($$("blockTeamLead"), webix.ProgressBar);
    $$("blockTeamLead").showProgress({
        type:"icon",
        hide : false
    });
    $$("blockTeamLead").disable()

    let teamLead = {
        firstName : "",
        lastName : ""
    }

    projectTeamData.get(order.dataBody.data.idProjectTeam)
        .then( response => {
            if(response.data){
                teamLead = response.data.teamLead
            }
            drawBlockTeamLead(teamLead)
        })
}

function drawBlockTeamLead(teamLead){
    webix.ui({
        id : "blockTeamLead",
        cols : [
            {
                id : "nameTeamLead",
                view:"label",
                align: "center",
                label : "Team Lead : "+ teamLead.firstName+ " " + teamLead.lastName,
                width : 250
            },
            {
                align: "left",
                view : "icon",
                width : 0,
                icon : "wxi-pencil",
                click : clickChangeTeamLead
            }
        ]
    }, $$("blockTeamLead"))
}

function clickChangeTeamLead(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordEdit + "team lead"
    }

    newOrder.dataBody = {
        state : mainData.stateChangeTeamLeadInProjectTeam,
        data : order.dataBody.data.teamLead,
        form : mainData.typeFormEdit,
        objActive : $$("nameTeamLead"),
        dataBase : mainData.stateProjectTeam,
        helpFunction : updateTeamLead,
        idInDataBase : order.dataBody.data.idProjectTeam,

    }

    showPage(newOrder)
}

function updateTeamLead(){
    let employee = this.data
    projectData.getProjectByProjectTeam(order.dataBody.data)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            for(let project of response.data) {
                deleteEmployeeFromTasks(employee, project.idProject)
            }
        })
    blockTeamLead()
}
