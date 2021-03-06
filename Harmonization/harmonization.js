let globalItem; // When svg is imported it is imported as a paper.js Item, we store a reference globally, so when a slider changes we can clear the screen and redraw with the new values
let rotationAngle;
let numberOfShapes;
let scalingFactor;
let width;
let height;
// Only executed our code once the DOM is ready.
window.onload = () => {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    // Install paper in the window context, so we can access all paper.js functions
    paper.install(window)
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    // Get the HTML sliders
    const rotationAngleSlider = document.getElementById("rotationAngle");
    const numberOfShapesSlider = document.getElementById("numberOfShapes");
    const scalingFactorSlider = document.getElementById("scalingFactor");

    // Add listeners to the sliders
    rotationAngleSlider.addEventListener("input", rotationAngleSliderChanged);
    numberOfShapesSlider.addEventListener("input", numberOfShapesSliderChanged);
    scalingFactorSlider.addEventListener("input", scalingFactorSliderChanged);

    // Initialize global variables
    rotationAngle = rotationAngleSlider.value;
    numberOfShapes = numberOfShapesSlider.value;
    scalingFactor = scalingFactorSlider.value;

    // load default svg
    const defaultSVG = './../shape.svg';
    loadSVG(defaultSVG);

    // add keyboard listener to save the svg when user press 's'
    document.addEventListener('keydown', (e) => {
        if (e.key === 's') {
            downloadAsSVG()
        }
    })
    document.getElementById("uploadInput").addEventListener("change", newFileUpload);
    document.getElementById("downloadBtn").addEventListener("click", () => downloadAsSVG());
}



// Functions to update the global variables when slider changes
function rotationAngleSliderChanged(event) {
    const newSliderValue = Number(event.target.value)
    rotationAngle = newSliderValue;
    drawItem()
}

function numberOfShapesSliderChanged(event) {
    const newSliderValue = Number(event.target.value)
    numberOfShapes = newSliderValue;
    drawItem()
}

function scalingFactorSliderChanged(event) {
    const newSliderValue = Number(event.target.value)
    scalingFactor = newSliderValue;
    drawItem()
}

// Draw items to the screen
function drawItem() {
    paper.project.clear(); // clear the screen, so we redraw with new values
    project.addLayer(new Layer(globalItem))
    globalItem.position = new paper.Point(width / 2, height / 2); // center the item
    // we clone the item in each iteration , rotate it, scale it and update the current clone with the rotated one, this repeats 'numberOfShapes' times
    let currentClone = globalItem.clone();
    for (let i = 0; i < numberOfShapes; i++) {
        const rotatedClone = currentClone.rotate(rotationAngle)
        rotatedClone.scale(scalingFactor)
        currentClone = rotatedClone.clone()
    }
}

// Helper functions load and download
function newFileUpload(e) {
    var reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = () => {
        let svgAsString = reader.result;
        loadSVG(svgAsString);
    };
    reader.readAsText(file);
}

function loadSVG(svg) {
    paper.project.importSVG(svg, {
        onLoad: (item) => {
            globalItem = item;
            globalItem.scale(2)
            drawItem();
        }
    })
}

function downloadAsSVG(fileName = "generative.svg") {
    const url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true }));
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}