package controllers

import (
	"app/app/models/entities"
	"app/app/models/providers"
	"github.com/revel/revel"
)

func (c App) ListTaskGetByProject(idProject int64) revel.Result {
	return c.RenderJSON(providers.ListTaskGetByProject(idProject))
}

func (c App) ListTaskSave() revel.Result {
	var listTask entities.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskSave(listTask, err))
}
func (c App) ListTaskUpdate() revel.Result {
	var listTask entities.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskUpdate(listTask, err))
}

func (c App) ListTaskDelete() revel.Result {
	var listTask entities.ListTask
	err := c.Params.BindJSON(&listTask)
	return c.RenderJSON(providers.ListTaskDelete(listTask, err))
}

