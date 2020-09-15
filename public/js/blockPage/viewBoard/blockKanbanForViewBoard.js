import {taskData} from "../../data/taskData.js";
import {idTask} from "./blockTaskForViewBoard.js"
import {clickEditTask} from "./blockTaskForViewBoard.js";

let projectTeam
let project
const HeightHourPX = 60
const HeightKanbanForOneDay = 512
const PADDING = 2

let mapHeightFreeInKanbanOneDay = new Map()

export function blockKanban(pt, pr){
    projectTeam = pt
    project = pr
    let columnEmployeeForDay = makeColumnEmployeesForDay()

    let date = new Date();

    let formatDate = {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };

    let i = 0
    let mainRowsKanban = []
    let dataMainRowsKanban = []

    while(i < 3){
        if(date.getDay() > 0 && date.getDay() < 6) {
            let dateId = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
            dataMainRowsKanban.push(new Date(date))

            let columnEmployeeForThisDay = webix.copy(columnEmployeeForDay)

            for(let i = 1; i < columnEmployeeForThisDay.length; i++){
                columnEmployeeForThisDay[i].body.id += "_date_" + dateId
            }

            mainRowsKanban.push({
                header : "<p class='headerForKanbanView' '> "+ date.toLocaleString("ru", formatDate) + "</p>",
                body : {
                    id : dateId,
                    multi: true,
                    view: "accordion",
                    cols: columnEmployeeForThisDay,
                }
            })
            i++
        }
        date.setDate(date.getDate() + 1)
    }


    webix.ui({
        view:"accordion",
        id: "blockKanban",
        type:"clean",
        multi: true,
        rows : mainRowsKanban
    }, $$("blockKanban"))

    dataMainRowsKanban.forEach(date =>{
        projectTeam.employees.forEach((employee) => {
            getTasksForEmployee(employee, date)
        })
        getTasksForEmployee(projectTeam.teamLead, date)
    })


}

function makeColumnEmployeesForDay(){
    let listHours =[
        { id:1, date:"10:00"},
        { id:2, date:"11:00"},
        { id:3, date:"12:00"},
        { id:4, date:"14:00"},
        { id:5, date:"15:00"},
        { id:6, date:"16:00"},
        { id:7, date:"17:00"},
        { id:8, date:"18:00"}
    ]

    let kanbanListForDay = [
        {
            header:"Время",
            width : 150,
            body :{
                view:"list",
                template:"<div style = 'height: " +HeightHourPX+ "px; " +
                    "text-align: center;'>#date#</div>",
                type : {
                    height : "auto"

                },
                scroll : false,
                height : HeightKanbanForOneDay,
                weight : 50,
                data: listHours,
            },
        }
    ]


    projectTeam.employees.forEach((employee) => {
        kanbanListForDay.push({
            header: employee.firstName + " " + employee.lastName,
            body :{
                id : "employee_" + employee.idEmployee,
            },
        })
    })

    if(projectTeam.teamLead.idEmployee > 0){
        kanbanListForDay.push({
            header: projectTeam.teamLead.firstName + " " + projectTeam.teamLead.lastName,
            body :{
                id : "employee_" + projectTeam.teamLead.idEmployee,
            },
        })
    }

    return kanbanListForDay
}

export function getTasksForEmployee(employee, date){
    let id = "employee_" + employee.idEmployee + "_date_" + date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()

    webix.extend($$(id), webix.ProgressBar);
    $$(id).showProgress({
        type:"icon",
        hide : false
    });

    let dataKanban = []
    taskData.getByEmployeeAndDate(employee, date)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            dataKanban.push(...response.data)
            drawKanbanEmployee(dataKanban, employee, date)
        })
}

function drawKanbanEmployee(dataKanban, employee, date){

    let id = "employee_" + employee.idEmployee + "_date_" + date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
    mapHeightFreeInKanbanOneDay.set(id, HeightKanbanForOneDay)
    webix.ui({
        id : id,
        view:"list",
        idEmployee : employee.idEmployee,
        dateKanban : date,
        template: function(obj){
            let urgent = ""
            for(let i = 0; i < obj.urgency.idUrgency; ++i){
                urgent += "<i class=\"far fa-xs fa-star urgentInTaskInKanban\"></i>"
            }
            let heightForTask = (obj.theoreticalTimeWork * HeightHourPX + (obj.theoreticalTimeWork+ (obj.theoreticalTimeWork * 10 % 10 !==0 ? +1 : +0))*PADDING*2)
            let heightMaxForBlock = mapHeightFreeInKanbanOneDay.get(id)
            if(heightMaxForBlock < heightForTask){
                heightForTask = heightMaxForBlock
            }
            heightMaxForBlock -= heightForTask
            if(heightForTask === 0){
                heightForTask = obj.theoreticalTimeWork * HeightHourPX
            }
            mapHeightFreeInKanbanOneDay.set(id, heightMaxForBlock)
            return "<div style = 'height: " +heightForTask+  "px'" +
                " class = 'taskInKanban "+ (obj.listTask.project.idProject !== project.idProject ?"taskFromOtherProject" : "")+"'>"
                + "<div class = 'textTaskInKanban'>"
                +"<p>"+ obj.formulation + " </br>" +obj.status.nameStatus + "</p>"
                + "</div><div class='urgentBlockInTaskInKanban'>"
                + urgent
                +"</div></div>"
        },
        type : {
            height : "auto",
        },
        drag : true,
        select:true,
        scroll : false,
        data: dataKanban,
        on: {
            onBeforeDrag : clickOnBeforeDragBlockKanban,
            onAfterDrop : clickOnBeforeDropBlockKanban,
            onItemClick : clickEditTask,
            onAfterAdd :  clickAfterAddInKanbanList,
        },

    }, $$(id))
}



function clickAfterAddInKanbanList(){
    let source = webix.DragControl.getContext();
    let id = source.to.getFirstId()
    while(id){
        let task = source.to.getItem(id)
        task.position = (source.to.getIndexById(id))
        task.employee.idEmployee = +source.to.B.idEmployee
        task.dateExecution = source.to.B.dateKanban
        taskData.update(task)
        id = source.to.getNextId(id)
    }
}

function clickOnBeforeDropBlockKanban(){
    let source = webix.DragControl.getContext();
    let task = source.to.getItem(source.source[0])

    //idTask - это id блока task
    if(source.from.B.id === idTask){
        source.from.add(task)
    } else {
        mapHeightFreeInKanbanOneDay.set(source.to.B.id, HeightKanbanForOneDay)
        if(source.from.B.id !== source.to.B.id){
            $$(source.to.B.id).render()
        }
    }
}

function clickOnBeforeDragBlockKanban(context){
    let task = this.getItem(context.source[0])
    if(task.listTask.project.idProject !== project.idProject){
        webix.message({
            text: "Это задание из другого проекта!",
            type:"error",
            expire: 3000,
        })
        return false
    }
    let source = webix.DragControl.getContext();
    mapHeightFreeInKanbanOneDay.set(source.from.B.id, HeightKanbanForOneDay)
}