import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/task/"

class TaskData{

    get(idTask){
        return dataUsualAction.getSomething(URL + idTask);
    }

    getByListTask(listTask){
        return dataUsualAction.getSomething(URL + "listTask/" + listTask.idListTask);
    }

    getByEmployee(employee){
        return dataUsualAction.getSomething(URL + "employee/" + employee.idEmployee);
    }

    getByEmployeeAndDate(employee, date){
        return dataUsualAction.getSomething(URL + "employee/" + employee.idEmployee + "/date/" + date.toString().split("(Армения, стандартное время)", 1));
    }

    getByEmployeeAndActiveTask(employee){
        return dataUsualAction.getSomething(URL + "employee/activeTask/" + employee.idEmployee);
    }

    save(task, idListTask){
        task.listTask = {
            idListTask : +idListTask
        }
        task.employee = {
            idEmployee : +task.idEmployee
        }
        task.status = {
            idStatus : +task.idStatus
        }
        task.urgency = {
            idUrgency : +task.idUrgency
        }
        task.theoreticalTimeWork = +task.theoreticalTimeWork
        dataUsualAction.save(task, URL)
    }

    remove(task){
        dataUsualAction.remove(task, URL)
    }

    update(task, idTask){
        if(!task.idTask) {
            //update from form
            task.idTask = +idTask
            task.status = {
                idStatus: +task.idStatus
            }
            task.employee = {
                idEmployee : -1
            }
            task.urgency = {
                idUrgency: +task.idUrgency
            }
        }
        task.theoreticalTimeWork = +task.theoreticalTimeWork
        task.realTimeWork = +task.realTimeWork
        dataUsualAction.update(task, URL)
    }
}

let taskData = new TaskData()

export {taskData}
