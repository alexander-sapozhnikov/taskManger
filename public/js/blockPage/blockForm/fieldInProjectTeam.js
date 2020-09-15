import {employeeData} from "../../data/employeeData.js";
import {projectData} from "../../data/projectData.js";
import {drawField} from "./formBlock.js";

export function fieldChangeTeamLeadInProjectTeam(){
    let data = {}

    let optionsTeamLead = []

    data.elements = [
        {
            name: "idTeamLead",
            view:"select",
            label:"Team Lead: ",
            labelWidth: 100,
            options: optionsTeamLead
        },
    ]

    employeeData
        .getAll()
        .then(response => {
            response.data.forEach(({idEmployee, lastName, middleName, firstName}) => {
                optionsTeamLead.push({
                    id : idEmployee,
                    value : lastName + " " + middleName + " " + firstName
                })
            });
            drawField(data)
        })
}

export function fieldAddEmployeeInProjectTeam(dataBody){
    let data = {}
    let options = []

    let haveEmployeesInProjectTeam = [dataBody.data.teamLead.idEmployee]

    let employees = dataBody.objActive.data.pull
    for (let key in employees) {
        if(employees[key].addNew) continue
        haveEmployeesInProjectTeam.push(employees[key].idEmployee)
    }

    data.elements = [
        {
            name: "idEmployee",
            view:"select",
            label:"Сотрудник: ",
            labelWidth: 100,
            options: options
        },
    ]

    data.rules = {
        "idEmployee": webix.rules.isNotEmpty
    }

    employeeData.getAll()
        .then(response => {
            response.data.forEach((employee) => {
                if(haveEmployeesInProjectTeam.indexOf(employee.idEmployee) === -1){
                    options.push({
                        id : employee.idEmployee,
                        value : employee.lastName + " " + employee.firstName
                    })
                }
            });
            drawField(data)
        })


}

export function fieldAddProjectInProjectTeam(){
    let data = {}
    let options = []

    data.elements = [
        {
            name: "idProject",
            view:"select",
            label:"Проект: ",
            labelWidth: 100,
            options: options
        },
    ]

    data.rules = {
        "idProject": webix.rules.isNotEmpty
    }

    projectData.getAll()
        .then(response => {
            response.data.forEach((project) => {
                if(project.projectTeam.idProjectTeam === 0){
                    options.push({
                        id : project.idProject,
                        value : project.nameProject
                    })
                }
            });

            drawField(data)
        })
}