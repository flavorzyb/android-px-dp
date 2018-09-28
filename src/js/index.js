$(document).ready(function () {
    const input = $("#px_input");
    input.change(function () {
        px2dp();
    });

    input.keyup(function () {
        px2dp();
    });

    function px2dp () {
        let value = parseInt(input.val());
        if (isNaN(value)) {
            value = 0;
        }

        $("#dp_input").val(value * 0.869565 / 3);
    }

    const btnCopy = $("#btn_copy");
    btnCopy.blur(function () {
        removeCopyTooltips();
    });

    btnCopy.mouseover(function () {
        removeCopyTooltips();
    });

    btnCopy.mouseout(function () {
        removeCopyTooltips();
    });

    function removeCopyTooltips () {
        btnCopy.tooltip("dispose");
        btnCopy.removeAttr("data-toggle");
        btnCopy.removeAttr("data-placement");
        btnCopy.removeAttr("data-original-title");
        btnCopy.removeAttr("title");
    }

    const clipboard = new ClipboardJS(document.getElementById("btn_copy"));
    clipboard.on("success", function (e) {
        e.clearSelection();
        if (e.text && e.text !== "") {
            btnCopy.attr("data-toggle", "tooltip");
            btnCopy.attr("data-placement", "bottom");
            btnCopy.attr("data-original-title", "已拷贝!");
            btnCopy.attr("title", "已拷贝!");
            btnCopy.tooltip("show");
        }
    });

    clipboard.on("error", function () {
        window.alert("复制失败!");
    });
});
