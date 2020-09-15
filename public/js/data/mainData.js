let mainData =  {
    headerTitleId : "headerTitle",
    headerBlockId : "headerBlock",
    bodyBlockId : "bodyBlock",

    popupBlock : "Popup",

    //type Header
    searchHeader : "search",
    titleAndBackHeader : "titleAndBack",
    justTitleHeader : "justTitleHeader",

    //type body
    mainBody : "main",
    editProjectTeamBody : "editProjectTeam",
    viewBoardBody : "viewBoard",
    formBody : "form",
    viewActionEmployeesBody : "actionEmployees",

    //img menu
    projectHeaderId : "projectImgMenu",
    projectTeamHeaderId : "projectTeamImgMenu",
    employeeHeaderId : "employeeImgMenu",

    //active img in menu
    active : "Active",

    //path to...
    pathToImg : "public/img/",

    //file types
    png : ".png",

    //state
    stateProject : "project",
    stateProjectTeam : "projectTeam",
    stateChangeTeamLeadInProjectTeam : "changeTeamLeadInProjectTeam",
    satefieldAddEmployeeInProjectTeam : "fieldAddEmployeeInProjectTeam",
    stateFieldAddProjectInProjectTeam : "fieldAddProjectInProjectTeam",
    stateChangeProjectTeamInProject : "changeProjectTeamInProject",
    stateEmployee : "employee",
    stateDelete : "delete",
    stateTask : "task",
    stateListTask : "listTask",

    //headerTitleAndBack
    wordAdd : "Добавить ",
    wordEdit : "Редактировать ",
    wordDelete : "Удалить ",

    //typeForm
    typeFormEdit : 1,
    typeFormDelete : 2,
}

//text for header
mainData.headerTitleMap = new Map();
mainData.headerTitleMap.set(mainData.projectHeaderId, "Проект")
mainData.headerTitleMap.set(mainData.projectTeamHeaderId, "Проектная группа")
mainData.headerTitleMap.set(mainData.employeeHeaderId, "Сотрудник")

//link for img in menu
mainData.ImgMenuMap = new Map();
mainData.ImgMenuMap.set(mainData.projectHeaderId, "project")
mainData.ImgMenuMap.set(mainData.projectTeamHeaderId, "projectTeam")
mainData.ImgMenuMap.set(mainData.employeeHeaderId, "employee")

//headerTitleAndBack
mainData.headerTitleAndBackMap = new Map();
mainData.headerTitleAndBackMap.set(mainData.projectHeaderId, "проект")
mainData.headerTitleAndBackMap.set(mainData.projectTeamHeaderId, "проектную группу")
mainData.headerTitleAndBackMap.set(mainData.employeeHeaderId, "сотрудника")

export {mainData};
