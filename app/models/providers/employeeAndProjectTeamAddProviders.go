package providers

import (
	"app/app/models/entities"
	"app/app/models/mappers"
	. "app/app/supporting"
)

func EmployeeAndProjectTeamAdd(employeeAndProjectTeam entities.EmployeeAndProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.EmployeeAndProjectTeamAdd(employeeAndProjectTeam))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func EmployeeAndProjectTeamRemove(employeeAndProjectTeam entities.EmployeeAndProjectTeam, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.EmployeeAndProjectTeamRemove(employeeAndProjectTeam))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}
