import {dataUsualAction} from "../supporting/dataUsualAction.js";
import {informAboutErrorWithWorkData} from "../supporting/helpFunction.js";

export function Employee(idEmployee, firstName, middleName, lastName){
    this.idEmployee = idEmployee;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
}

const URL = "/employee/"

class EmployeeData{


    getAll(){
        return dataUsualAction.getSomething(URL)
    }

    get(idEmployee){
        return dataUsualAction.getSomething(URL + idEmployee);
    }

    getByLoginAndPassword(employee){
        return fetch(URL  + "authorization", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)})
            .catch(error => {informAboutErrorWithWorkData(error)})
            .then(response => {
                if (!response.ok) informAboutErrorWithWorkData(response, "Попробуйте ещё раз!")
                else return response.json()})
            .then(response => {
                if (response.error) informAboutErrorWithWorkData(response, "Попробуйте ещё раз!")
                else return response})
    }

    getByProjectTeam(projectTeam){
        return dataUsualAction.getSomething(URL + "projectTeam/" + projectTeam.idProjectTeam);
    }

    remove(employee){
        dataUsualAction.remove(employee, URL)
    }

    save(employee){
        dataUsualAction.save(employee, URL)
    }

    update(employee, idEmployee){
        item.idEmployee = idEmployee
        dataUsualAction.update(employee, URL)
    }
}

let employeeData = new EmployeeData()

export {employeeData}
