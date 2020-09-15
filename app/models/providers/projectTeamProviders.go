package providers

import (
	"app/app/models/entities"
	"app/app/models/mappers"
	. "app/app/supporting"
)

func ProjectTeamAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	projectAll, err := mappers.ProjectTeamAllGet()
	data["error"] = ErrorInDatabase(err)
	data["data"] = projectAll
	return data
}

func ProjectTeamGet(idProjectTeam int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.ProjectTeamGet(idProjectTeam)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func ProjectTeamSave(projectTeam entities.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ProjectTeamSave(projectTeam))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func ProjectTeamUpdate(projectTeam entities.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ProjectTeamUpdate(projectTeam))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func ProjectTeamDelete(projectTeam entities.ProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ProjectTeamDelete(projectTeam))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}
