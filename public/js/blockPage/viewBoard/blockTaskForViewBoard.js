import {listTaskData} from "../../data/listTaskData.js";
import {taskData} from "../../data/taskData.js";
import {mainData, Order} from "../../data/mainData.js";
import {showPage} from "../../showPage.js";
import {idBlockTaskAndListTask} from "./viewBoardBlock.js";
import {getTasksForEmployee} from "./blockKanbanForViewBoard.js";

let activeListTask
let order
const idBlockListTask = "blockListTask"
export const idTask = "blockTask"

export function blockTasks(o){
    order = o
    drawBlockListTaskAndTask()
    getListTask()
    drawBlockTask([])
}

function drawBlockListTaskAndTask(){
    webix.ui({
        id : idBlockTaskAndListTask,
        view:"accordion",
        type:"clean",
        rows:[
            {
                id : "listTaskAccordion",
                header: "Список задач",
                body : {
                    rows : [
                        {
                            id : idBlockListTask,
                        },
                        {
                            view: "button",
                            template: "<div class='flexBox'>" +
                                "<p style=' margin: auto'><i class='far fa-plus-square' ></i> Добавить список задач </p>" +
                                "</div>",
                            height : 35,
                            on:{
                                onItemClick: clickAddListTask,
                            }
                        },
                    ]
                }
            },
            {
                id : "taskAccordion",
                header: "Задачи",
                collapsed: true,
                body : {
                    rows :[
                        {
                            height: 35,
                            view:"toolbar",
                            elements:[
                                {
                                    view:"text",
                                    id:"blockTasksFind",
                                    label:"Поиск ",
                                    css:"fltr",
                                    labelWidth:60
                                }
                            ]
                        },
                        {
                            view:"toggle",
                            name:"s3",
                            offLabel:"Фильтровать по срочности (выкл)",
                            onLabel:"Фильтровать по срочности (вкл)",
                            on : {
                                onChange : function (need) {
                                    if(need){
                                        $$(idTask).sort("#urgency#", "desc", (a, b)=>  a.idUrgency > b.idUrgency ? 1 : -1)
                                    } else {
                                        $$(idTask).sort("#idTask#", "asc", "int")
                                    }
                                }
                            }
                        },
                        {
                            id : idTask,
                        },
                        {
                            view: "button",
                            template: "<div class='flexBox'>" +
                                "<p style=' margin: auto'><i class='far fa-plus-square' ></i> Добавить задачу </p>" +
                                "</div>",
                            height : 35,
                            on:{
                                onItemClick: clickAddTask,
                            }
                        },
                    ]
                }
            }
        ]
    }, $$(idBlockTaskAndListTask))

    $$("blockTasksFind").attachEvent("onTimedKeyPress",function(){
        let value = this.getValue().toLowerCase();
        $$(idTask).filter(function(obj){
            return obj.formulation.toLowerCase().indexOf(value) > -1
                || obj.description.toLowerCase().indexOf(value) > -1;
        })
    });
}

function getListTask(){
    webix.extend($$(idBlockListTask), webix.ProgressBar);
    $$(idBlockListTask).showProgress({
        type:"icon",
        hide : false
    });

    listTaskData.getByProject(order.dataBody.data.idProject)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            drawBlockListTask(response.data)
        })
}

function drawBlockListTask(listTasks){
    webix.ui({
        id : idBlockListTask,
        view:"list",
        template: "#nameListTask#"
            + "<span class='editTask fas fa-edit' style = ' font-size : 17px;  float: right'></span>"
            + " <span class='deleteTask fas fa-trash' style = ' font-size : 17px; margin-right: 5px; float: right'></span> ",
        data: listTasks,
        select: true,
        onClick: {
            "deleteTask" : clickDeleteListTask,
            "editTask" : clickEditListTask,

        },
        on: {
            onItemDblClick: clickChoiceListTask,
        },

    }, $$(idBlockListTask))
}

function clickAddListTask(){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordAdd + " список задач"
    }

    newOrder.dataBody = {
        state : mainData.stateListTask,
        dataBase : mainData.stateListTask,
        idInDataBase : order.dataBody.data.idProject,
        helpFunction : getListTask
    }

    showPage(newOrder)
}

function clickEditListTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordEdit + " список задач"
    }

    newOrder.dataBody = {
        state : mainData.stateListTask,
        form : mainData.typeFormEdit,
        data : $$(idBlockListTask).getItem(id),
        objActive : $$(idBlockListTask),
        dataBase : mainData.stateListTask,
        idInDataBase : $$(idBlockListTask).getItem(id).idListTask,
        helpFunction : getListTask
    }
    showPage(newOrder)
    return false
}

function clickDeleteListTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordDelete + "список задач"
    }

    newOrder.dataBody = {
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : $$(idBlockListTask).getItem(id),
        objActive : $$(idBlockListTask),
        dataBase : mainData.stateListTask,
        oldOrder : order,
    }
    showPage(newOrder)
    return false
}

function clickChoiceListTask(id){
    activeListTask = $$(idBlockListTask).getItem(id)
    if(!activeListTask) {
        webix.message({
            text:"Cписок задач не изменен.",
            type:"error",
            expire: 1000,
        })
        return
    }

    $$("listTaskAccordion").define("collapsed", "true")

    updateDataInTasks()
}



function drawBlockTask(tasks){
    webix.ui({
        id : idTask,
        view:"list",
        template: (task) => {
            // let urgent = ""
            // for(let i = 0; i < task.urgency.idUrgency; ++i){
            //     urgent += "<i class='fas fa-0.5x fa-angle-up'></i>"
            // }
            // "<div class='flexBox' style='margin: 0'>"
            return  (task.employee.idEmployee > 0 ? "<i class='fas fa-hammer'></i> " : "")
                + task.formulation
                + "<span class='editTask fas fa-edit' style = ' font-size : 17px;  float: right'></span>"
                + " <span class='deleteTask fas fa-trash' style = ' font-size : 17px;  margin-right: 5px; float: right'></span> "
            // +  "<div class='urgentBlockInTaskInKanban'>" + urgent + "</div> " +
            // + "</div>"
        },
        select: true,
        data: tasks,
        drag : true,
        type : {
        },
        onClick: {
            "deleteTask" : clickDeleteTask,
        },
        on: {
            onBeforeDrag: clickOnBeforeDragBlockTask,
            onBeforeDrop : clickOnBeforeDropBlockTask,
            onItemClick : clickEditTask,
        },

    }, $$(idTask))
}

function clickOnBeforeDragBlockTask(context){
    if(this.getItem(context.start).employee.idEmployee > 0){
        webix.message("Это задание уже есть на доске")
        return false
    }
}

function clickOnBeforeDropBlockTask(context){
    let source = webix.DragControl.getContext();
    if(source.from.B.id === idTask){
        return true
    }
    let task = source.from.getItem(source.source[0])
    task.employee ={}
    task.employee.idEmployee = 0

    let id = context.to.getFirstId()
    while(id){
        if(context.to.getItem(id).idTask === task.idTask){
            context.to.getItem(id).employee.idEmployee = 0
            break
        }
        id = context.to.getNextId(id)
    }
    context.to.render()
    source.from.remove(source.source[0])
    taskData.update(task)
    return false
}



function clickAddTask(){
    if(!activeListTask){
        webix.message({
            text:"Для добавления задач выберете список.",
            type:"error",
            expire: 1000,
        })
        return
    }
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody);

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordAdd + " задачу"
    }

    newOrder.dataBody = {
        state : mainData.stateTask,
        dataBase : mainData.stateTask,
        idInDataBase : activeListTask.idListTask,
        helpFunction : updateDataInTasks
    }

    showPage(newOrder)
}

export function clickEditTask(id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordEdit + " задачу"
    }

    newOrder.dataBody = {
        state : mainData.stateTask,
        form : mainData.typeFormEdit,
        data : this.getItem(id),
        objActive : this,
        dataBase : mainData.stateTask,
        idInDataBase : this.getItem(id).idTask,
        helpFunction : updateDataInBlockTaskAndBlockKanban
    }
    showPage(newOrder)
    return false
}

function clickDeleteTask(_, id){
    let newOrder = new Order(true, mainData.justTitleHeader, mainData.formBody)

    newOrder.dataHeader = {
        innerHeaderTitle : mainData.wordDelete + "задачу"
    }

    newOrder.dataBody = {
        state : mainData.stateDelete,
        form : mainData.typeFormDelete,
        data : $$(idTask).getItem(id),
        objActive : $$(idTask),
        dataBase : mainData.stateTask,
        helpFunction : updateDataInBlockTaskAndBlockKanban
    }
    showPage(newOrder)
    return false
}

function updateDataInBlockTaskAndBlockKanban(){
    let task = this.data
    let activeListTask = $$(idBlockListTask).getItem($$(idBlockListTask).getSelectedId())

    if(activeListTask
        && activeListTask.idListTask === task.listTask.idListTask){
        updateDataInTasks()
    }

    if(task.employee.idEmployee > 0){
        getTasksForEmployee(task.employee, new Date(task.dateExecution))
    }
}


function updateDataInTasks(){
    webix.extend($$(idTask), webix.ProgressBar);
    $$(idTask).showProgress({
        type:"icon",
        hide : false
    });

    taskData.getByListTask(activeListTask)
        .then( response => {
            if(!response.data){
                response.data = []
            }
            $$(idTask).clearAll()
            $$(idTask).parse(response.data)
        })
}
