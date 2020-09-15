package mappers

import (
	"app/app/models/entities"
	. "app/app/supporting"
)

func ListTaskGetByProject(idProjectTeam int64) ([]entities.ListTask, error) {
	sqlString := "SELECT idlisttask, namelisttask FROM listtask left outer join project p on p.idproject = listtask.idproject WHERE p.idproject = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)
	var listTaskAll []entities.ListTask

	defer CloseRows(rows)

	for err == nil && rows.Next() {
		var listTask entities.ListTask
		err = rows.Scan(&listTask.IdListTask, &listTask.NameListTask)
		if err == nil {
			listTaskAll = append(listTaskAll, listTask)
		}
	}
	return listTaskAll, err
}

func ListTaskSave(listTask entities.ListTask) error {
	sqlString := `INSERT INTO listTask (namelisttask, idproject) VALUES ($1, $2);`
	_, err := DB.Exec(sqlString, listTask.NameListTask, listTask.Project.IdProject)
	return err
}

func ListTaskUpdate(listTask entities.ListTask) error {
	sqlString := `UPDATE listTask SET namelisttask = $1 WHERE idlistTask = $2;`
	_, err := DB.Exec(sqlString, listTask.NameListTask, listTask.IdListTask)
	return err
}

func ListTaskDelete(listTask entities.ListTask) error {
	sqlString := `DELETE FROM task WHERE idlistTask = $1`
	_, err := DB.Exec(sqlString, listTask.IdListTask)

	sqlString = `DELETE FROM listTask WHERE idlistTask = $1`
	_, err = DB.Exec(sqlString, listTask.IdListTask)

	return err
}
