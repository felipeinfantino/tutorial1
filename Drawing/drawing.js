let path;

window.onload = () => {
    paper.install(window)
    paper.setup('myCanvas')
    
    view.onMouseDrag = onMouseDrag;
    view.onMouseDown = onMouseDown;
    view.onMouseUp = () => path.simplify(50);

    document.getElementById('downloadBtn').addEventListener('click', () => downloadAsSVG())
    document.getElementById('clearBtn').addEventListener('click', () => paper.project.clear())
    
}

function onMouseDown(event) {
    // Create a new path and set its stroke color to black:
    path = new Path({
        segments: [event.point],
        strokeColor: 'black',
        fullySelected: false,
        strokeWidth: 0.4
    });
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
    path.add(event.point);
}

function downloadAsSVG(fileName = "shape.svg") {
    console.log(paper.project.getItems())
    const url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true, bounds: 'content' }));
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}
