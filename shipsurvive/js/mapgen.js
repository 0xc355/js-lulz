/* generates a map graph */
$(function(){
 "use strict";
var globals = {},
defaults = {
	background: 'white',
	font: '14px Arial',
	num_seed_points: 1500,
	wind_scale: 10
},
containers = {};

/* core functions */

var core = {
	init: function() {
		globals.canvas = $('#board');
		var cv = globals.canvas[0];
		cv.onselectstart = function () { return false; }
		globals.context = cv.getContext('2d');
		globals.context.background = defaults.background;
		globals.params = {noise_size: 1, radius_size:9};
		globals.bounds = {
			start_x: 5, start_y: 5,
			end_x: globals.canvas[0].width-5,
			end_y: globals.canvas[0].height-5
		};
		globals.size = {
			height: (globals.bounds.end_x - globals.bounds.start_x),
			width: (globals.bounds.end_y - globals.bounds.start_y)
		};
		globals.centroid = {
			x: (globals.bounds.end_x + globals.bounds.start_x)/2,
			y: (globals.bounds.end_y + globals.bounds.start_y)/2
		};
		$("#size_slider").slider({max:10, min:0, step:.1, value:1, slide:core.change_size});
		$("#noise_slider").slider({max:10, min:0, step:.1, value:1, slide:core.change_noise});

		var ratio = this.hiDPIRatio();
		if (ratio != 1) {
			var originalWidth = cv.width;
			var originalHeight = cv.height;

			cv.css({
				width: originalWidth + "px",
				height: originalHeight + "px"
			});
			globals.context.scale(ratio, ratio);
		}
		globals.context.font = defaults.font;

		cv.addEventListener('click', this.generate_map, true);
		cv.addEventListener('contextmenu', this.relax, true);
		this.generate_map();
	},
	change_size: function(event, ui) {
		globals.params.radius_size = 10 - ui.value;
		var val = Math.round(ui.value * 10)/10;
		$("p#size_display").text("Size: " + val);
	},
	change_noise: function(event, ui) {
		globals.params.noise_size = ui.value;
		var val = Math.round(ui.value * 10)/10;
		$("p#noise_display").text("Noise: " + val);
	},
	generate_map: function() {

	}
	redraw_map: function(centroids, test_points) {
	},
	hiDPIRatio: function() {
		var devicePixelRatio, backingStoreRatio;

		devicePixelRatio = window.devicePixelRatio || 1;
		backingStoreRatio = globals.context.webkitBackingStorePixelRatio ||
				globals.context.mozBackingStorePixelRatio ||
				globals.context.msBackingStorePixelRatio ||
				globals.context.oBackingStorePixelRatio ||
				globals.context.backingStorePixelRatio || 1;

		return devicePixelRatio / backingStoreRatio;
	}
}
var utilities = {
	random_interval : function(a, b) {
		return Math.round(Math.random() * (b - a) + a);
	},
	colormap_jet : function(value) {
		var interpolate = function (val, y0, x0, y1, x1) {
		    return (val-x0)*(y1-y0)/(x1-x0) + y0;
		}
		var base = function(val) {
		    if (val <= -0.75) return 0;
		    else if (val <= -0.25) return interpolate( val, 0.0, -0.75, 1.0, -0.25 );
		    else if (val <= 0.25) return 1.0;
		    else if (val <= 0.75) return interpolate( val, 1.0, 0.25, 0.0, 0.75 );
		    else return 0.0;
		}
		value = Math.max(Math.min(1, value),-1);

		var red = Math.round(base(value - 0.5) * 255);
		var green = Math.round(base(value) * 255);
		var blue = Math.round(base(value + 0.5) * 255);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}
}
var mapgen_functions = {

}
var draw_functions = {
	draw_border : function(ctx, width) {
		var cv = globals.canvas[0];
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, cv.width, cv.height);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(width, width,
				cv.width - width * 2, cv.height - width * 2);
	}
}

core.init();
});