package v1

type CreateNamesapceRequest struct {
	Name                string `json:"name" required:"true"`
	SkipAutoPropagation bool   `json:"skip_auto_propagation"`
}
type CreateNamesapceResponse struct{}
