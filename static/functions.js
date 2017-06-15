function eventHandler(e) {

}
$("#forma").submit(function(e) {
	e.preventDefault();
	var $this = $(this);
	console.log($this.serialize());
	$.post(
		$this.attr("action"),
		$this.serialize(),
		function(data) {console.log(data.results);$("#output").val(data.results.val)},
		"json"
	);
});