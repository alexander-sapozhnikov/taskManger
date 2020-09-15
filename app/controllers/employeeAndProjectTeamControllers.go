package controllers

import (
	"app/app/models/entities"
	"app/app/models/providers"
	"github.com/revel/revel"
)

func (c App) EmployeeAndProjectTeamAdd() revel.Result {
	var employeeAndProjectTeam entities.EmployeeAndProjectTeam
	err := c.Params.BindJSON(&employeeAndProjectTeam)
	return c.RenderJSON(providers.EmployeeAndProjectTeamAdd(employeeAndProjectTeam, err))
}

func (c App) EmployeeAndProjectTeamRemove() revel.Result {
	var employeeAndProjectTeam entities.EmployeeAndProjectTeam
	err := c.Params.BindJSON(&employeeAndProjectTeam)
	return c.RenderJSON(providers.EmployeeAndProjectTeamRemove(employeeAndProjectTeam, err))
}
