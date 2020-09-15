import {mainData, Order} from "../data/mainData.js";
import {projectData} from "../data/projectData.js"
import {employeeData} from "../data/employeeData.js"
import {projectTeamData} from "../data/projectTeamData.js"
import {taskData} from "../data/taskData.js";
import {listTaskData} from "../data/listTaskData.js";
import {showPage} from "../showPage.js";

export function getHeaderIdForThisPage(){
    let headerId 
    mainData.headerTitleMap.forEach((value, key) => {
        if(value === $$(mainData.headerTitleId).getValue()) {
            headerId = key
            return
        }
    });
    return headerId
}

export function defineStateThroughTitleHeaderOrId(id){
    if (!id){
        id = getHeaderIdForThisPage();
    }

    switch (id) {
        case mainData.projectHeaderId:
            return mainData.stateProject
        case mainData.projectTeamHeaderId:
            return mainData.stateProjectTeam
        case mainData.employeeHeaderId:
            return mainData.stateEmployee
    }
}

export function choiseDataBase(state){

    let dataBase;

    switch(state){
        case mainData.stateProject:
            dataBase = projectData
            break
        case mainData.stateProjectTeam:
            dataBase = projectTeamData
            break
        case mainData.stateEmployee:
            dataBase = employeeData
            break
        case mainData.stateChangeTeamLeadInProjectTeam:
            dataBase = projectTeamData  
            break
        case mainData.stateTask:
            dataBase = taskData  
            break
        case mainData.stateListTask:
            dataBase = listTaskData  
            break
    }

    return dataBase
}

export function clickBackToMain(){
    let order = new Order(false, mainData.searchHeader, mainData.mainBody)
    order.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
    }
    order.dataBody = {
        state : defineStateThroughTitleHeaderOrId(),
        dataBase : defineStateThroughTitleHeaderOrId(),
    }
    showPage(order)
}

export function informAboutErrorWithWorkData(data, methodResolve = "Перезагрузите страницу.") {
    if(data.message){
        data.error = data.message
    } else if(!data.error){
        data.error = data.status + " " + data.statusText
    }
    webix.message({
        text: "Произошла ошибка: <br/>"+ data.error + "<br/>" + methodResolve,
        type:"error",
        expire: -1,

    })
}

export function informAboutSuccess(data) {
    webix.message({
        text: data,
        type:"success",
        expire: 2000,

    })
}

export function deleteEmployeeFromTasks(employee, idProject){
    taskData.getByEmployee(employee)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            response.data.forEach(task => {
                if(task.listTask.project.idProject === idProject){
                    task.employee.idEmployee = 0
                    taskData.update(task)
                }
            })
        })

}