import {dataUsualAction} from "../supporting/dataUsualAction.js";

const URL = "/urgency/"

class UrgencyData{
    getAll(){
        return dataUsualAction.getSomething(URL)
    }
}

let urgencyData = new UrgencyData()
export {urgencyData}