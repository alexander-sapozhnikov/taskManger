import {projectTeamData} from "../../data/projectTeamData.js";
import {drawField} from "./formBlock.js";
import {employeeData} from "../../data/employeeData.js";
import {mainData} from "../../data/mainData.js";

export function fieldProject(){
    let data = {}

    let options = [{
        id : 0,
        value : ""
    }]

    data.elements = [
        {
            name: "nameProject",
            view: "text",
            label: "Имя проекта*:",
            labelWidth: 200
        },
        {
            name: "idProjectTeam",
            view: "select",
            label: "Проектная группа: ",
            labelWidth: 200,
            value: 0,
            options: options
        }
    ]

    data.rules = {"nameProject": webix.rules.isNotEmpty}

    projectTeamData.getAll()
        .then(response => {
            response.data.forEach(({idProjectTeam, nameProjectTeam}) => {
                options.push({
                    id: idProjectTeam,
                    value: nameProjectTeam
                })
            })
            drawField(data)
        })
}

export function fieldProjectTeam(){
    let data = {}

    let optionsTeamLead = [{
        id : 0,
        value : ""
    }]
    let options = []


    data.elements = [
        {
            name : "nameProjectTeam",
            view:"text",
            label:"Имя проектной группы*:",
            labelWidth: 200
        },

        {
            name: "idTeamLead",
            view:"select",
            label:"Team Lead: ",
            labelWidth: 200,
            options: optionsTeamLead
        },

        {
            name :  "employees",
            view: "dbllist",
            list:{
                minHeight: 100,
                maxHeight: 300,
                scroll: true
            },
            labelBottomLeft:"Все сотрудники",
            labelBottomRight:"Выбранные сотрудники",
            data: options
        }
    ]

    data.rules = {
        "nameProjectTeam": webix.rules.isNotEmpty
    }

    employeeData.getAll()
        .then(response => {
            response.data.forEach(({idEmployee, lastName, firstName}) => {
                options.push({
                    id : idEmployee,
                    value : firstName + " " + lastName
                })
            });
            optionsTeamLead.push(...options)
            drawField(data)
        })
}

export function fieldEmployee(it){
    let data = {}
    let item = it

    data.elements = [
        {
            name : "firstName",
            view: "text",
            label:"Имя*:",
            labelWidth: 200,
            value: item ? item.firstName : ""
        },
        {
            name : "middleName",
            view: "text",
            label:"Отчество:",
            labelWidth: 200,
            value: item ? item.middleName : ""
        },
        {
            name : "lastName",
            view: "text",
            label:"Фамилия*:",
            labelWidth: 200,
            value: item ? item.lastName : ""
        },
    ]

    data.rules = {
        "firstName": webix.rules.isNotEmpty,
        "lastName": webix.rules.isNotEmpty,
    }

    if(!item){
        data.elements.push(...[
            {
                name : "login",
                view: "text",
                label:"Login*:",
                labelWidth: 200
            },
            {
                name : "password",
                view:"text",
                type:"password",
                label:"Password*:",
                labelWidth: 200
            },
        ])

        data.rules.login = webix.rules.isNotEmpty
        data.rules.password = webix.rules.isNotEmpty
    }


    data.state = mainData.stateEmployee
    drawField(data)
}

export function fieldDelete(){
    let data = {}

    data.elements = [
        {
            view:"label",
            width : 200,
            label:"Вы точно хотите удалить?"
        }
    ]

    data.rules = {}

    data.state = mainData.stateDelete

    drawField(data)
}