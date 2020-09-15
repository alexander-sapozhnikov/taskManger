import {mainData} from "./data/mainData.js";
import {blockHeader} from "./blockPage/headerBlock.js"
import {mainBlock} from "./blockPage/mainBlock.js"
import {formBlock} from "./blockPage/formType/formBlock.js"
import {viewBoardBlock} from "./blockPage/viewBoard/viewBoardBlock.js"
import {editProjectTeamBlock} from "./blockPage/editProjectTeam/editProjectTeamBlock.js"
import {actionEmployeesBlock} from "./blockPage/viewActionEmployeesBlock.js"


export function showPage(order){
    order.headerBlockId = mainData.headerBlockId
    order.bodyBlockId = mainData.bodyBlockId

    if(order.float){
        order.headerBlockId += mainData.popupBlock
        order.bodyBlockId += mainData.popupBlock
        $$(mainData.popupBlock).show()
    }

    blockHeader(order)

    switch(order.typeBody){
        case mainData.mainBody:
            mainBlock(order)
            break;
        case mainData.editProjectTeamBody:
            editProjectTeamBlock(order)
            break;
        case mainData.viewBoardBody:
            viewBoardBlock(order)
            break;
        case mainData.formBody:
            formBlock(order)
            break;
        case mainData.viewActionEmployeesBody:
            actionEmployeesBlock(order)
            break;
    }
}
