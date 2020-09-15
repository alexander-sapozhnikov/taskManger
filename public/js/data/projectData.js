import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/project/"

class ProjectData{
    getAll(){
        return dataUsualAction.getSomething(URL)
    }

    get(idProject){
        return dataUsualAction.getSomething(URL + idProject);
    }

    getProjectByProjectTeam(projectTeam){
        return dataUsualAction.getSomething(URL + "projectTeam/" + projectTeam.idProjectTeam);
    }

    remove(item){
        dataUsualAction.remove(item, URL)
    }

    save(item){
        item.projectTeam = {}
        item.projectTeam.idProjectTeam = +item.idProjectTeam
        dataUsualAction.save(item, URL)
    }

    update(item, idInDataBase){
        if(idInDataBase){
            item.idProject = idInDataBase
        }
        if(!item.projectTeam){
            item.projectTeam = {}
            item.projectTeam.idProjectTeam= +item.idProjectTeam
        }
        item.idProject = +item.idProject
        dataUsualAction.update(item, URL)
    }
}

let projectData = new ProjectData()

export {projectData}