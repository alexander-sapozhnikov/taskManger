package mappers

import (
	"app/app/models/entities"
	. "app/app/supporting"
	"database/sql"
)

func ProjectAllGet() (projectAll []entities.Project, err error) {
	sqlString := "SELECT idproject, nameproject, p.idprojectteam, p.nameprojectteam from project LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam ORDER BY idproject"
	rows, err := DB.Query(sqlString)

	defer CloseRows(rows)

	for err == nil && rows.Next() {
		var project entities.Project
		var idProjectTeam sql.NullInt64
		var nameProjectTeam sql.NullString
		err = rows.Scan(&project.IdProject, &project.NameProject, &idProjectTeam, &nameProjectTeam)
		if err == nil {
			project.ProjectTeam.IdProjectTeam = idProjectTeam.Int64
			project.ProjectTeam.NameProjectTeam = nameProjectTeam.String
			projectAll = append(projectAll, project)
		}
	}

	return projectAll, err
}

func ProjectGet(idProject int64) (project entities.Project, err error) {
	sqlString := "SELECT idproject, nameproject, " +
		"p.idprojectteam, p.nameprojectteam, " +
		"p.idteamlead, firstname, middlename, lastname " +
		"from project " +
		"LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam " +
		"left join employee e on p.idteamlead = e.idemployee " +
		"WHERE idproject = $1"
	rows, err := DB.Query(sqlString, idProject)

	defer CloseRows(rows)

	if err == nil && rows.Next() {
		var idProjectTeam sql.NullInt64
		var nameProjectTeam sql.NullString

		var idTeamLead sql.NullInt64
		var firstName sql.NullString
		var middleName sql.NullString
		var lastName sql.NullString
		err = rows.Scan(&project.IdProject, &project.NameProject,
			&idProjectTeam, &nameProjectTeam,
			&idTeamLead, &firstName, &middleName, &lastName)

		if err == nil {
			project.ProjectTeam = entities.ProjectTeam{
				IdProjectTeam:   idProjectTeam.Int64,
				NameProjectTeam: nameProjectTeam.String,
			}

			project.ProjectTeam.TeamLead = entities.Employee{
				IdEmployee: idTeamLead.Int64,
				FirstName:  firstName.String,
				MiddleName: middleName.String,
				LastName:   lastName.String,
			}
			return project, err
		}
	}
	return project, err
}

func ProjectGetByProjectTeam(idProjectTeam int64) (projectAll []entities.Project, err error) {
	sqlString := "SELECT idproject, nameproject from project LEFT JOIN projectteam p on project.idprojectteam = p.idprojectteam WHERE p.idprojectteam = $1"
	rows, err := DB.Query(sqlString, idProjectTeam)

	defer CloseRows(rows)

	for err == nil && rows.Next() {
		var project entities.Project
		err = rows.Scan(&project.IdProject, &project.NameProject)
		if err == nil {
			projectAll = append(projectAll, project)
		}
	}

	return projectAll, err
}

func ProjectSave(project entities.Project) (err error) {
	if project.ProjectTeam.IdProjectTeam == 0 {
		sqlString := `INSERT INTO project (nameproject) VALUES ($1);`
		_, err = DB.Exec(sqlString, project.NameProject)

	} else {
		sqlString := `INSERT INTO project (nameproject, idprojectteam) VALUES ($1, $2);`
		_, err = DB.Exec(sqlString, project.NameProject, project.ProjectTeam.IdProjectTeam)
	}
	return err
}

func ProjectUpdate(project entities.Project) (err error) {
	if project.NameProject == "" {
		if project.ProjectTeam.IdProjectTeam != 0 {
			sqlString := `UPDATE project SET idprojectteam = $1 WHERE idproject = $2;`
			_, err = DB.Exec(sqlString, project.ProjectTeam.IdProjectTeam, project.IdProject)
		} else {
			sqlString := `UPDATE project SET idprojectteam = NULL WHERE idproject = $1;`
			_, err = DB.Exec(sqlString, project.IdProject)
		}
	} else {
		sqlString := `UPDATE project SET nameproject = $1 WHERE idproject = $2;`
		_, err = DB.Exec(sqlString, project.NameProject, project.IdProject)
	}
	return err
}

func ProjectDelete(project entities.Project) error {
	sqlString := `DELETE FROM project WHERE idproject = $1`
	_, err := DB.Exec(sqlString, project.IdProject)
	return err
}
