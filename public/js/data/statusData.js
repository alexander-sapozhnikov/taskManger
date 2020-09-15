import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/status/"

class StatusData{
    getAll(){
        return dataUsualAction.getSomething(URL)
    }
}

let statusData = new StatusData()

export {statusData}