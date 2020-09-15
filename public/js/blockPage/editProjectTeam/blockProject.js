import {projectData} from "../../data/projectData.js";
import {clickDeleteItem, order} from "./editProjectTeamBlock.js";
import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";


export function blockProject() {

    webix.extend($$("blockProject"), webix.ProgressBar);
    $$("blockProject").showProgress({
        type:"icon",
        hide : false
    });

    $$("blockProject").disable()

    projectData.getProjectByProjectTeam(order.dataBody.data)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            response.data.push({addNew: true})
            drawBlockProject(response)
        })
}

function drawBlockProject(projects){
    webix.ui({
        id: "blockProject",
        width: "auto",
        rows: [
            {
                align: "center",
                view: "label",
                label: "Проекты",
            },
            {
                id: "projectDataview",
                view: "list",
                width: 250,
                height: 0,
                type: {
                    width: "auto",
                    height: "auto",
                    template: getTemplateProject,
                },
                select: false,
                data: projects,
                onClick: {
                    "deleteBtn": clickDeleteItem,
                    "addBtn": clickAddProject,
                },
            }
        ]
    }, $$("blockProject"))
}

function getTemplateProject(data){
    if(data.addNew){
        return "<div class='addBtn' style='display: flex; justify-content: center; height: auto; '> " +
            "<i class='far fa-plus-square'  style = ' font-size : 25px; text-align: center; margin: auto 0'></i>" +
            "<p style='text-align: center; font-size: 25px; margin-left: 5px'>проект</p>"+
            "</div>"
    } else {
        return "<div style='position: relative; display: flex; flex-direction: column; justify-content: center; height: auto'> <p style='text-align: center'>"+
            data.nameProject + "</p>"
            + " <span class='deleteBtn fas fa-trash' style = ' font-size : 20px; cursor: pointer; position: absolute; right: 0; top: 0;'></span> </div> "
    }
}

function clickAddProject(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        headerTitle : $$(mainData.headerTitleId).getValue(),
        innerHeaderTitle : mainData.wordAdd + mainData.headerTitleAndBackMap.get(mainData.projectHeaderId)
    }

    newOrder.dataBody = {
        state : mainData.stateFieldAddProjectInProjectTeam,
        dataBase : mainData.stateProjectTeam,
        form : mainData.typeFormEdit,
        data : order.dataBody.data,
        objActive : this,
        idInDataBase : order.dataBody.data.idProjectTeam,
        helpFunction : blockProject
    }

    showPage(newOrder)
}