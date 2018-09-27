const pxInput = document.getElementById("px_input");
pxInput.onchange = function () {
    transform();
};

pxInput.onblur = function () {
    transform();
};

pxInput.onkeyup = function () {
    transform();
};

function transform () {
    let px = parseInt(pxInput.value);
    if (isNaN(px)) {
        px = 0;
    }

    document.getElementById("dp_input").value = px * 0.869565 / 3;
}

const clipboard = new ClipboardJS(document.getElementById('btn_copy'));
clipboard.on("success", function (e) {
    e.clearSelection();
});
clipboard.on("error", function () {
    window.alert("复制失败!");
});