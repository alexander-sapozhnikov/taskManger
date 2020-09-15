import {informAboutErrorWithWorkData} from "../../supporting/helpFunction.js";
import {employeeData} from "../../data/employeeData.js";
import {projectData} from "../../data/projectData.js";
import {blockProjectTeam} from "./blockProjectForViewBoard.js"
import {blockKanban} from "./blockKanbanForViewBoard.js"
import {blockTasks} from "./blockTaskForViewBoard.js"

let order
let projectTeam
export const idBlockTaskAndListTask = "blockTaskAndListTask"

export function viewBoardBlock(o){
    order = o
    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    projectData.get(order.dataBody.data.idProject)
        .then( response => {
            if(response.error){
                informAboutErrorWithWorkData(response)
                return
            }
            if(!response.data){
                response.data = {}
            }
            projectTeam = response.data.projectTeam
            getProjectTeamEmployee()

        })
}

function getProjectTeamEmployee(){
    employeeData.getByProjectTeam(projectTeam)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            projectTeam.employees = response.data
            drawViewBoardBlock()
        })
}

function drawViewBoardBlock(){
    webix.ui({
        id : order.bodyBlockId,
        multi:true,
        view:"accordion",
        type:"wide",
        cols:[
            {
                gravity : 1.3,
                header:"<p class='headerForKanbanView' '>Проектная команда</p>",
                body: {id : "blockProjectTeam",},
                collapsed:false },
            {
                gravity : 4,
                body: {
                    view:"scrollview",
                    scroll:"y",
                    height: 0,
                    width: 0,
                    body:{id : "blockKanban"}
                    },
                collapsed:false
            },
            {
                gravity : 1.8,
                header:"<p class='headerForKanbanView' '>Списки и задачи</p>",
                body: {id : idBlockTaskAndListTask},
                collapsed:false
            },
        ]
    }, $$(order.bodyBlockId))
    blockProjectTeam(projectTeam, order)
    blockKanban(projectTeam, order.dataBody.data)
    blockTasks(order)
}