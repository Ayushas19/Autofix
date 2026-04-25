const { createCanvas } = require("canvas");
try {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 200, 200);
  console.log("Canvas works! Data URL length:", canvas.toDataURL().length);
} catch (err) {
  console.error("Canvas failed:", err.message);
}
