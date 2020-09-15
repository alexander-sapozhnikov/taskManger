import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/employeeAndProjectTeam/"

class EmployeeAndProjectTeamData{

    add(idProjectTeam, idEmployee){
        let item = {
            idProjectTeam : +idProjectTeam,
            idEmployee : +idEmployee
        }
        dataUsualAction.save(item, URL)
    }

    remove(idProjectTeam, idEmployee){
        let item = {
            idProjectTeam : +idProjectTeam,
            idEmployee : +idEmployee
        }
        dataUsualAction.remove(item, URL)
    }
}

let employeeAndProjectTeamData = new EmployeeAndProjectTeamData()

export {employeeAndProjectTeamData}