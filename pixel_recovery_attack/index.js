let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let canvas_code = document.getElementById("canvas-code");

async function hash_algo(src) {
	// encode as UTF-8
	const data = new TextEncoder().encode(src);

	// hash the message
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

// generate cavnas content
function canvasFingerPrint() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	// generate a layer on canvas

	context.fillStyle = "rgba(50, 50, 50,1)";
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	// context.stroke();
	context.closePath();

	// generate a rectangle
	context.fillStyle = "rgba(110, 100, 50,1)";
	context.beginPath();
	context.rect(40, 30, 100, 100);
	context.fill();
	context.stroke();
	context.closePath();

	context.fillStyle = "rgba(200, 100, 50,1)";
	context.beginPath();
	context.rect(200, 30, 100, 100);
	context.fill();
	context.stroke();
	context.closePath();

	context.fillStyle = "rgba(20, 140, 50,1)";
	context.beginPath();
	context.rect(300, 200, 150, 100);
	context.fill();
	context.stroke();
	context.closePath();

	let img = context.getImageData(0, 0, canvas.width, canvas.height);
	console.log(img.data);
	let shift = {
		r: img.data[0] - 50,
		g: img.data[1] - 50,
		b: img.data[2] - 50,
		a: img.data[3] - 255,
	};

	// reverse the noise
	console.log(shift);
	let src = "";
	for (let i = 0; i < canvas.height; i++) {
		for (let j = 0; j < canvas.width; j++) {
			let n = i * (canvas.width * 4) + j * 4;
			let r, g, b;
			img.data[n + 0] = img.data[n + 0] - shift.r;
			r = img.data[n + 0];
			img.data[n + 1] = img.data[n + 1] - shift.g;
			g = img.data[n + 1];
			img.data[n + 2] = img.data[n + 2] - shift.b;
			b = img.data[n + 2];
			img.data[n + 3] = img.data[n + 3] - shift.a;
			src += rgbToHex(r, g, b);
		}
	}
	src += "OS Platform: " + navigator.platform + "\n";
	src += "Browser's Engine Name: " + navigator.product + "\n";
	src += "Total width/height: " + screen.width + "*" + screen.height + "\n";
	src += "Color depth: " + screen.colorDepth + "\n";
	src += "Color resolution: " + screen.pixelDepth + "\n";
	src += "Browser version info: " + navigator.appVersion + "\n";
	// console.log(src);
	return src;
}

// convert rbg to hex
const rgbToHex = (r, g, b) =>
	"#" +
	[r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		})
		.join("");

// generate canvas fingerprinting
function get_real_canvas_id() {
	let canvas_fingerprint = canvasFingerPrint();
	hash_algo(canvas_fingerprint).then((h) => {
		canvas_code.textContent += h;
	});
}

window.addEventListener("load", (event) => {
	get_real_canvas_id();
});
