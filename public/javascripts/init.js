bogie = {};
var $updates_ul = $('#updates_ul');

function addUpdate (data) {
	console.log(data);
	// operation:"create", value:req.body.name, timestamp:timestamp
		var $li = $("<li>").text(data.operation+ ": " + data.value +" at:"+ data.timestamp);
		$li.addClass('collection-item');
		$updates_ul.append($li);
		console.log($li);
}

$(document).ready(function() {
	Materialize.updateTextFields();
	var socket = io.connect();

    socket.on('notification',function (data) {
    	console.log('notification');
    	addUpdate(data);
    });


	$('.item_checks').change(function(e) {
		// /subscribe/:item_id
		console.log(this);
		if (this.checked) {
			$.ajax({
				url: "/subscribe/" + this.id,
				type: 'PUT',
				success: function(msg) { console.log(msg.message) },
				error: function(msg) { console.log(msg.message) }
			});
		} else {
			$.ajax({
				url: "/subscribe/" + this.id,
				type: 'DELETE',
				success: function(msg) { console.log(msg.message) },
				error: function(msg) { console.log(msg.message) }
			});
		}

	});

	$('#unsubscribe_all').click(function(argument) {
		var el = this;
		if(this.textContent == 'Unsubscribe All'){
			// unsubscribe all
			$('.item_checks').each(function (e, el) {
				// console.log(el);
				$(el).prop('checked', false);
			});

			$.ajax({
				url: "/subscribe_all",
				type: 'DELETE',
				success: function(msg) {
					console.log(msg.message);
					el.textContent = 'Subscribe All';
				},
				error: function(msg) { console.log(msg.message) }
			});
		}else{
			// subscribe all
			$('.item_checks').each(function (e, el) {
				// console.log(el);
				$(el).prop('checked', true);
			});

			$.ajax({
				url: "/subscribe_all",
				type: 'GET',
				success: function(msg) {
					console.log(msg.message);
					el.textContent = 'Unsubscribe All';
				},
				error: function(msg) { console.log(msg.message) }
			});

		}

		bogie = this;
	})



});
