import {dataUsualAction} from "../supporting/dataUsualAction.js";
import {employeeAndProjectTeamData} from "./employeeAndProjectTeamData.js";
import {projectData} from "./projectData.js";

function ProjectTeam(idProjectTeam, nameProjectTeam, teamLead, employees){
    this.idProjectTeam = idProjectTeam
    this.nameProjectTeam = nameProjectTeam
    this.teamLead = teamLead
    this.employees = employees
}

const URL = "/projectTeam/"

class ProjectTeamData{
    getAll(){
        return dataUsualAction.getSomething(URL)
    }

    get(idProjectTeam){
        return dataUsualAction.getSomething(URL + idProjectTeam);
    }

    remove(projectTeam, idProjectTeam){
        if(projectTeam.idProjectTeam) {
            //dlt team
            dataUsualAction.remove(projectTeam, URL)
        } else if(projectTeam.idProject) {
            //dlt project in team
            projectTeam.nameProject = ""
            projectData.update(projectTeam)
        } else {
            //dlt employee in team
            employeeAndProjectTeamData.remove(idProjectTeam, projectTeam.idEmployee)
        }
    }

    save(item){
        item.teamLead = {}
        item.teamLead.idEmployee = +item.idTeamLead
        let employees = item.employees.split(",")
        item.employees = []
        for(let id of employees){
            item.employees.push({
                idEmployee : +id
            })
        }
        dataUsualAction.save(item, URL)
    }

    update(item, idProjectTeam){
        item.idProjectTeam = idProjectTeam
        item.teamLead = {}
        if(item.idTeamLead){
            //update team lead
            item.teamLead.idEmployee = +item.idTeamLead
            dataUsualAction.update(item, URL)
        } else if (item.idEmployee){
            //upd employee in team
            employeeAndProjectTeamData.add(idProjectTeam, item.idEmployee)
        } else if (item.idProject){
            //upd project in team
            item.projectTeam = {}
            item.projectTeam.idProjectTeam = +idProjectTeam
            projectData.update(item)
        }
    }
}

let projectTeamData = new ProjectTeamData()

export {projectTeamData}