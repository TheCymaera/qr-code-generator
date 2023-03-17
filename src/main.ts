import { fa5_brands_github, fa5_solid_download, fa5_solid_fileDownload, fa5_solid_home, fa5_solid_vectorSquare } from "fontawesome-svgs";
import "./main.css";
import qrCodeGen from "./vendor/qrCodeGen.js";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

function drawQRCode(qr: qrCodeGen.QrCode, imageScale: number, margin: number) {
	canvas.width = (qr.size + margin * 2) * imageScale;
	canvas.height = (qr.size + margin * 2) * imageScale;

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#000";
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y)) {
				ctx.fillRect((x + margin) * imageScale, (y + margin) * imageScale, imageScale, imageScale);
			}
		}
	}
}

function toSvgString(qr: qrCodeGen.QrCode, margin: number): string {
	const lightColor = "#fff";
	const darkColor = "#000";

	if (margin < 0)
		throw new RangeError("Border must be non-negative");
	let parts: Array<string> = [];
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y))
				parts.push(`M${x + margin},${y + margin}h1v1h-1z`);
		}
	}
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + margin * 2} ${qr.size + margin * 2}" stroke="none">
<rect width="100%" height="100%" fill="${lightColor}"/>
<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`
	}

const textInput = document.querySelector("#text") as HTMLInputElement;
const eccInput = document.querySelector("#ecc") as HTMLSelectElement;
const marginInput = document.querySelector("#margin") as HTMLInputElement;
const imageScaleInput = document.querySelector("#imageScale") as HTMLInputElement;
const resolutionDisplay = document.querySelector("#resolutionDisplay")!;
const downloadRasterButton = document.querySelector("#downloadRaster") as HTMLButtonElement;
const downloadSVGButton = document.querySelector("#downloadSVG") as HTMLButtonElement;

let svgText = "";
function onChange() {
	const ecc = ({
		"L": qrCodeGen.QrCode.Ecc.LOW,
		"M": qrCodeGen.QrCode.Ecc.MEDIUM,
		"Q": qrCodeGen.QrCode.Ecc.QUARTILE,
		"H": qrCodeGen.QrCode.Ecc.HIGH,
	})[eccInput.value as "L" | "M" | "Q" | "H"];

	const margin = parseInt(marginInput.value) || 0;

	const qr = qrCodeGen.QrCode.encodeText(textInput.value, ecc);

	drawQRCode(
		qr,
		parseInt(imageScaleInput.value) || 1,
		margin,
	);

	svgText = toSvgString(qr, margin);

	resolutionDisplay.textContent = `${canvas.width} x ${canvas.height}`;
}

textInput.addEventListener("input", onChange);
eccInput.addEventListener("change", onChange);
marginInput.addEventListener("input", onChange);
imageScaleInput.addEventListener("input", onChange);
onChange();


downloadRasterButton.addEventListener("click", () => {
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/png");
	a.download = "qr.png";
	a.click();
});

downloadSVGButton.addEventListener("click", () => {
	const a = document.createElement("a");
	a.href = "data:image/svg+xml," + encodeURIComponent(svgText);
	a.download = "qr.svg";
	a.click();
});



downloadRasterButton.querySelector("i")!.innerHTML = fa5_solid_download;
downloadSVGButton.querySelector("i")!.innerHTML = fa5_solid_download;
document.querySelector("#home")!.innerHTML = fa5_solid_home;
document.querySelector("#github")!.innerHTML = fa5_brands_github;