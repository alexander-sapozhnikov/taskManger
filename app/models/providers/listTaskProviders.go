package providers

import (
	"app/app/models/entities"
	"app/app/models/mappers"
	. "app/app/supporting"
)

func ListTaskGetByProject(idProject int64) map[string]interface{} {
	data := make(map[string]interface{})
	listTask, err := mappers.ListTaskGetByProject(idProject)
	data["error"] = ErrorInDatabase(err)
	data["data"] = listTask
	return data
}

func ListTaskSave(listTask entities.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ListTaskSave(listTask))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func ListTaskUpdate(listTask entities.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ListTaskUpdate(listTask))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func ListTaskDelete(listTask entities.ListTask, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.ListTaskDelete(listTask))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}
