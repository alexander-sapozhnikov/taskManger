package entities

type Employee struct {
	IdEmployee  int64 `json:"idEmployee"`
	FirstName   string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName string `json:"lastName"`
	Login string `json:"login"`
	Password string `json:"password"`
}
