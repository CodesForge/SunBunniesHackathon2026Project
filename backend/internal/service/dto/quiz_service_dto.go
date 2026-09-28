package dto

type GenerateQuestionRequestDTO struct {
	Message string `json:"message"`
}

type GenerateQuestionResponseDTO struct {
	Answer string `json:"answer"`
}
