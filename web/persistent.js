$.get_id = function(callback) {
	if (!localStorage.id) {
		localStorage.id = 0
	}
	$.i = Math.floor(localStorage.id)
    callback()
} 

$.set_id = function(token) {
	localStorage.id = token
}