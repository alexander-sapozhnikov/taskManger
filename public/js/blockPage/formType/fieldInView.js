import {projectTeamData} from "../../data/projectTeamData.js";
import {taskData} from "../../data/taskData.js";
import {statusData} from "../../data/statusData.js";
import {urgencyData} from "../../data/urgencyData.js";
import {employeeData} from "../../data/employeeData.js";
import {mainData} from "../../data/mainData.js";
import {drawField} from "./formBlock.js";

export function changeProjectTeamInProject(){
    let data = {}
    let options = []

    data.elements = [
        {
            name: "idProjectTeam",
            view:"select",
            label:"Проектные команды: ",
            labelWidth: 160,
            width : 350,
            options: options
        },
    ]

    data.rules = {
        "idProjectTeam": webix.rules.isNotEmpty
    }

    projectTeamData.getAll()
        .then(response => {
            response.data.forEach((projectTeam) => {
                options.push({
                    id : projectTeam.idProjectTeam,
                    value : projectTeam.nameProjectTeam
                })
            });

            drawField(data)
        })
}

let wait
let statusAll = []
let urgencyAll = []
let employeeAll = []
let item = {}
export function fieldTask(dataBody){
    wait = 0;

    item = undefined
    if(dataBody.data) {
        wait++
        taskData.get(dataBody.data.idTask)
            .then(response => {
                item = response.data
                wait--
                drawFieldTask()
            })
    }

    wait++
    statusAll = []
    statusData.getAll()
        .then(response => {
            response.data.forEach(status => {
                statusAll.push({
                    id : status.idStatus,
                    value : status.nameStatus
                })
            })
            wait--
            drawFieldTask()
        })

    wait++
    urgencyAll = []
    urgencyData.getAll()
        .then(response => {
            response.data.forEach(urgency => {
                urgencyAll.push({
                    id : urgency.idUrgency,
                    value : urgency.nameUrgency
                })
            })
            wait--
            drawFieldTask()
        })

    wait++
    employeeAll = [{
        id : 0,
        value : ""
    }]
    employeeData.getAll()
        .then(response => {
            response.data.forEach(employee => {
                employeeAll.push({
                    id : employee.idEmployee,
                    value : employee.firstName + " " + employee.middleName + " " + employee.lastName
                })
            })
            wait--
            drawFieldTask()
        })

}

export function drawFieldTask(){
    if(wait !== 0) return
    let data = {}
    let labelWidth = 180
    data.elements = [
        {
            name : "formulation",
            view: "text",
            label:"Формулировка*:",
            labelWidth: labelWidth,
            value: item ? item.formulation : ""
        },
        {
            name : "description",
            view: "textarea",
            label:"Описание:",
            labelWidth: labelWidth,
            height: 100,
            value: item ? item.description : ""
        },
        {
            name : "theoreticalTimeWork",
            view: "text",
            label:"Время работы (в часах):",
            labelWidth: labelWidth,
            value: item ? item.theoreticalTimeWork : ""
        },
        {
            name: "idStatus",
            view:"select",
            label:"Статус: ",
            value : item ? item.status.idStatus : 0,
            labelWidth: labelWidth,
            options: statusAll
        },
        {
            name: "idUrgency",
            view:"select",
            label:"Срочность: ",
            value : item ? item.urgency.idUrgency : 0,
            labelWidth: labelWidth,
            options: urgencyAll
        },
    ]

    data.rules = {
        "formulation": webix.rules.isNotEmpty,
        "theoreticalTimeWork": webix.rules.isNumber,
    }

    if(item){
        //for case with edit task
        data.elements.push({
            name : "realTimeWork",
            view: "text",
            label:"Время реальной работы (в часах):",
            labelWidth: labelWidth,
            value: item ? item.realTimeWork : 0
        })
        if(item.employee.idEmployee) {
            data.elements.push({
                view: "label",
                label: "Сотрудник: " + item.employee.firstName + " " + item.employee.middleName + " " + item.employee.lastName,
            })
        }

        data.elements.push({
            view: "label",
            label: "Проект: " + item.listTask.project.nameProject + " Список задач: " + item.listTask.nameListTask ,
        })

        data.rules.realTimeWork = webix.rules.isNumber

    }

    data.state = mainData.stateEmployee
    data.width = 750
    drawField(data)
}

export function fieldListTask(order){
    let item = order.dataBody.data
    let data = {}

    data.elements = [
        {
            name : "nameListTask",
            view:"text",
            label:"Имя списка задач*:",
            labelWidth: 150,
            inputWidth : 350,
            value : item ? item.nameListTask : ""
        }
    ]

    data.rules = {"nameListTask": webix.rules.isNotEmpty}
    data.width = 400
    drawField(data)
}

