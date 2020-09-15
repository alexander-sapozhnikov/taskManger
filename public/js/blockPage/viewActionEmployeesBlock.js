import {taskData} from "../data/taskData.js";
import {employeeData} from "../data/employeeData.js";
import {mainData, Order} from "../data/mainData.js";
import {showPage} from "../showPage.js";

let projectTeam
let order
const HeightHourPX = 67
const PADDING = 4
let listHours =[{id : 1, date : 1}]

export function actionEmployeesBlock(o){
    order = o
    projectTeam = o.dataBody.data
    webix.extend($$(order.bodyBlockId), webix.ProgressBar);
    $$(order.bodyBlockId).showProgress({
        type:"icon",
        hide : false
    });

    employeeData.getByProjectTeam(projectTeam)
        .then( response => {
            if(!response.data){
                response.data = {}
            }
            let employees = response.data
            drawActionEmployeesBlock(makeColumnEmployees(employees))
            employees.forEach((employee) => {
                getTasksForEmployee(employee)
            })
            getTasksForEmployee(projectTeam.teamLead)
        })

}

function makeColumnEmployees(employees){
    let kanbanList = [
        {
            header:"Часы",
            width : 150,
            body :{
                id : "timeLine",
                view:"list",
                template:"<div style = 'height: " + (HeightHourPX + 6) + "px; display: flex; justify-content: center; " +
                    " border-bottom: 2px dotted;'><p style='text-align: center; margin: auto;'>#date#</p></div>",
                type : {
                    height : "auto"

                },
                scroll : false,
                weight : 50,
                data: listHours,
            },
            scroll: false
        }
    ]


    if(employees.forEach) {
        employees.forEach((employee) => {
            kanbanList.push({
                header: employee.firstName + " " + employee.lastName,
                body: {
                    id: "employee_" + employee.idEmployee,
                },
            })
        })
    }
    if(projectTeam.teamLead.idEmployee > 0){
        kanbanList.push({
            header: projectTeam.teamLead.firstName + " " + projectTeam.teamLead.lastName,
            body :{
                id : "employee_" + projectTeam.teamLead.idEmployee,
            },
        })
    }
    return kanbanList
}

function drawActionEmployeesBlock(columnEmployees){
    webix.ui({
        id: order.bodyBlockId,
        cols : [{
            view: "scrollview",
            scroll: "y",
            height: 0,
            width: 0,
            body: {
                view: "accordion",
                type: "clean",
                multi: true,
                cols: columnEmployees
            }
        }]
    }, $$(order.bodyBlockId))

}

function getTasksForEmployee(employee){
    let id = "employee_" + employee.idEmployee
    webix.extend($$(id), webix.ProgressBar);
    $$(id).showProgress({
        type:"icon",
        hide : false
    });

    taskData.getByEmployeeAndActiveTask(employee)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            let countHours = drawKanbanEmployee(response.data, employee)
            let flag = false
            for(let i = listHours.length; i <= countHours + 2; ++i){
                flag = true
                listHours.push({
                    id: i,
                    date:i
                })
            }
            if(flag) {
                $$("timeLine").parse(listHours)
                $$("timeLine").render()
            }
        })
}

function drawKanbanEmployee(tasks, employee){
    let id = "employee_" + employee.idEmployee
    let countHours = 0
    tasks.forEach(task =>{
        countHours += task.theoreticalTimeWork
    })
    webix.ui({
        id : id,
        view:"list",
        template: function(obj){
            let urgent = ""
            for(let i = 0; i < obj.urgency.idUrgency; ++i){
                urgent += "<i class=\"far fa-xs fa-star urgentInTaskInKanban\"></i>"
            }
            let heightForTask = (obj.theoreticalTimeWork * HeightHourPX + (obj.theoreticalTimeWork+ (obj.theoreticalTimeWork * 10 % 10 !==0 ? +1 : +0))*PADDING*2) - 4
            return "<div style = 'height: " +heightForTask+  "px; border: 2px dotted; border-radius: 5px'" +
                " class = 'taskInKanban'>"
                + "<div class = 'textTaskInKanban'>"
                +"<p>"+ obj.formulation + " </br>" +obj.status.nameStatus + "</p>"
                + "</div><div class='urgentBlockInTaskInViewBoard'>"
                + urgent
                +"</div></div>"
        },
        type : {
            height : "auto",
        },
        select: true,
        scroll : false,
        data: tasks,
        height : countHours * HeightHourPX + countHours * PADDING * 2,
        on: {
            onItemClick : clickEditTask,
        },

    }, $$(id))

    return countHours
}

function clickEditTask(id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordEdit + " задачу"
    }

    newOrder.dataBody = {
        state : mainData.stateTask,
        form : mainData.typeFormEdit,
        data : this.getItem(id),
        objActive : this,
        dataBase : mainData.stateTask,
        idInDataBase : this.getItem(id).idTask,
        helpFunction :  () => {
            let task = this.data
            getTasksForEmployee(this.getItem(id).employee)
        }
    }
    showPage(newOrder)
    return false
}
