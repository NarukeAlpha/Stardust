package main

type message struct {
	Id      string `json:"id,omitempty"`
	Content string `json:"content,omitempty"`
	Thread  string `json:"thread,omitempty"`
	Agent   string `json:"agent,omitempty"`
	Flow    string `json:"flow,omitempty"`
}

type newChat struct {
	Messages []message `json:"messages"`
	Flow     string    `json:"flow,omitempty"`
	Agent    string    `json:"agent,omitempty"`
}
