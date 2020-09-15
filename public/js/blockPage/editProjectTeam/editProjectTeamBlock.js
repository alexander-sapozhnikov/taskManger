import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {projectData} from "../../data/projectData.js";
import {employeeData} from "../../data/employeeData.js";
import {deleteEmployeeFromTasks, informAboutErrorWithWorkData} from "../../supporting/helpFunction.js";
import {projectTeamData} from "../../data/projectTeamData.js"
import {blockTeamLead} from "./blockTeamLead.js";
import {blockEmployee} from "./blockEmployees.js";
import {blockProject} from "./blockProject.js";

export let order
export const idEmployeeBlock = "employeeDataView"
export function editProjectTeamBlock(o){
    order = o
    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    projectTeamData.get(order.dataBody.data.idProjectTeam)
        .then( response => {
            if(!response.data){
                response.data = {}
            }
            order.dataBody.data = response.data
            drawEditProjectTeamBlock()
        })
}

function drawEditProjectTeamBlock(){
    webix.ui({
        id : order.bodyBlockId,
        cols :[
            {
                height : 0,
                rows:[
                    {
                        cols : [{},{id : "blockTeamLead"},{},]
                    },
                    {
                        align : "center",
                        view:"label",
                        label : "Сотрудники",
                    },
                    {
                        id : idEmployeeBlock,
                    }
                ]
            },
            {
                view:"resizer"
            },
            {
                id : "blockProject"
            }
        ]
    }, $$(order.bodyBlockId))

    blockTeamLead()
    blockEmployee()
    blockProject()
}

export function clickDeleteItem(_, id){

    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    let idHeader = mainData.employeeHeaderId

    if(this !== $$(idEmployeeBlock)){
        idHeader = mainData.projectTeamHeaderId
    }

    newOrder.dataHeader = {
         headerTitle : mainData.headerTitleMap.get(mainData.projectTeamHeaderId),
         innerHeaderTitle : mainData.wordDelete + mainData.headerTitleAndBackMap.get(idHeader)
    }

    newOrder.dataBody = { 
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : this.getItem(id),
        objActive : this,
        dataBase : mainData.stateProjectTeam,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : restTaskForEmployeeOrProject
    }

    showPage(newOrder)
}

function restTaskForEmployeeOrProject(){
    if(this.data.idEmployee){
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
        .catch(error => informAboutErrorWithWorkData(error))
    } else {
        let project = this.data
        employeeData.getByProjectTeam({idProjectTeam : this.idInDataBase})
            .then( response => {
                if(!response.data){
                    response.data = []
                }
                for(let employee of response.data) {
                    deleteEmployeeFromTasks(employee, project.idProject)
                }
            })
    }
}