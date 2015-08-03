
var infobutton = false;

function testcreation() {

    var sdd = document.createElement('select');
    sdd.setAttribute('id', 'tempsdd');
    document.getElementsByClassName('panel-head')[0].appendChild(sdd);
    var option = document.createElement("option");
    option.text = "";
    option.value = "";
    sdd.add(option);
    for (var i = 0; i < 5; i++) {
        var option = document.createElement("option");
        option.text = "Value " + i;
        option.value = "value" + i;
        sdd.add(option);
    }

}

function showhideinfo() {
    if (!infobutton) {
        document.getElementById('information').style.position = "fixed";
        if (document.getElementById('mycanvas').style.visibility == "visible") {
            document.getElementById('drawstyle').style.marginLeft = "7%";
            document.getElementById('information').innerHTML = "<center>Canvas Information:</center>The dropdown contains all the different drawing tools.<br>The first color is the main drawing color.<br>The secondary color is used/shown only when required by tool.<br>The Clear Canvas button will clean the canvas.<br>The textbox represents the line width of the tool.<br>The Switch To Textbox boutton will switch the canvas to a textbox.<br>The next dropdown will switch this overlay from half-screen to full-screen or vice versa.<br>The last dropdown changes the opacity of this overlay.";
        } else {
            document.getElementById('canvascolor').style.marginLeft = "7%";
            document.getElementById('information').innerHTML = "<center>Textbox Information:</center>The color is the font and border color, if it is updated, it will change all the font.<br>The clear button will remove all the text.<br>The Switch To Canvas button will go back to the canvas.<br>The next dropdown will switch this overlay from half-screen to full-screen or vice versa.<br>The last dropdown changes the opacity of this overlay."
        }
        infobutton = true;
    } else {
        document.getElementById('drawstyle').style.marginLeft = "10px";
        document.getElementById('canvascolor').style.marginLeft = "10px";
        document.getElementById('information').style.position = "static";
        document.getElementById('information').innerHTML = "?";
        infobutton = false;
    }
}

function testPanel() {

    var panellist = document.getElementsByClassName('highcharts-series-group');
    var selectdd = document.getElementById('uniqueidselect');
    selectdd.setAttribute('onchange', 'updatepaths()');

    for (var i = selectdd.length - 1; i > -1; i--) {
        selectdd.remove(i);
    }

    var option = document.createElement('option');
    option.text = '';
    option.value = 'blank';
    selectdd.add(option);

    for (var j = 0; j < panellist.length; j++) {
        var parentname = panellist[j].parentNode;
        while (parentname.getAttribute('class') != "panel-body") {
            parentname = parentname.parentNode;
        }
        parentname = parentname.parentNode.childNodes[0].childNodes;
        for (var i = 0; i < parentname.length; i++) {
            if (parentname[i].nodeName == "H3") {
                var option = document.createElement("option");
                option.text = parentname[i].innerHTML;
                option.value = parentname[i].innerHTML;
                selectdd.add(option);
            }
        }
    }

}

function backswitch2(specific) {

    var uniqueid = specific.value;
    var path = document.querySelectorAll('path');

    if (uniqueid == "back") {

        for (var i = 0; i < path.length; i++) {
            if (path[i].getAttribute('fill') != null && path[i].getAttribute('fill') != "none") {
                path[i].setAttribute('stroke', 'transparent');
                path[i].setAttribute('stroke-opacity', '0.0001');
            }
        }

        testPanel();
    } else if (uniqueid != "empty") {

        for (var i = 0; i < path.length; i++) {
            if (path[i].getAttribute('fill') != null && path[i].getAttribute('fill') != "none") {
                if (path[i].getAttribute('d') == uniqueid) {
                    path[i].setAttribute('stroke', 'black');
                    path[i].setAttribute('stroke-opacity', '1');
                    path[i].setAttribute('stroke-width', '5');
                } else {
                    path[i].setAttribute('stroke', 'transparent');
                    path[i].setAttribute('stroke-opacity', '0.0001');
                }
            }
        }
    }

}

function updatepaths2() {

    for (var z = 1; z < document.getElementById('uniqueidselect').length; z++) {
        var panellist = document.getElementsByClassName('highcharts-series-group');
        var selectdd = document.getElementById('uniqueidselect').options[z].text;;
        var count = 0;
        var specname = 0;
        
        for (var i = 0; i < panellist.length; i++) {
            var parentname = panellist[i].parentNode;
            while (parentname.getAttribute('class') != "panel-body") {
                parentname = parentname.parentNode;
            }
            parentname = parentname.parentNode.childNodes[0].childNodes;
            for (var j = 0; j < parentname.length; j++) {
                if (parentname[j].nodeName == "H3") {
                    if (parentname[j].innerHTML == selectdd) {
                        specname = i;
                    }
                }
            }
        }

        var panelhead = selectdd + ' sdd';
        var doesexist = document.getElementById(panelhead);

        if (doesexist == null || doesexist == undefined) {

            var sdd = document.createElement('select');
            sdd.setAttribute('id', selectdd + ' sdd');
            sdd.setAttribute('style', "width: 150px");
            sdd.setAttribute('onchange', 'backswitch2(this)');
            var parentname = panellist[specname].parentNode;
            while (parentname.getAttribute('class') != "panel-body") {
                parentname = parentname.parentNode;
            }
            parentname = parentname.parentNode;
            parentname.childNodes[0].appendChild(sdd);

            var option = document.createElement('option');
            option.text = '';
            option.value = "blank";
            document.getElementById(panelhead).add(option);

            var sddcolor = document.createElement('input');
            sddcolor.setAttribute('type', 'color');
            sddcolor.setAttribute('style', "width: 100px");
            sddcolor.setAttribute('onchange', "updatepath2(this, '" + panelhead + "')");
            parentname.childNodes[0].appendChild(sddcolor);

            var sddcb = document.createElement('input');
            sddcb.setAttribute('type', 'checkbox');
            sddcb.setAttribute('class', 'cblocks');
            sddcb.setAttribute('name', selectdd);
            sddcb.setAttribute('style', 'margin: 7px; margin-bottom: 10px;');
            parentname.childNodes[0].appendChild(sddcb);

            var sddp = document.createElement('p');
            sddp.setAttribute('style', 'display: inline-block');
            sddp.innerHTML = "Lock colors";
            parentname.childNodes[0].appendChild(sddp);

        }

        var actualnames = [];
        var ctype = "";
        var templocal = panellist[specname].parentNode.childNodes;

        for (var i = 0; i < templocal.length; i++) {
            if (templocal[i].getAttribute('class') == "highcharts-legend") {
                ctype = "legend"
                i = templocal.length;
            } else {
                ctype = "pie";
            }
        }
        
        if (ctype == "pie") {
            for (var i = 0; i < panellist[specname].parentNode.childNodes.length; i++) {
                if (panellist[specname].parentNode.childNodes[i].getAttribute('class') == "highcharts-data-labels highcharts-tracker") {
                    for (var j = 0; j < panellist[specname].parentNode.childNodes[i].childNodes.length; j++) {
                        actualnames.push(panellist[specname].parentNode.childNodes[i].childNodes[j].childNodes[0].childNodes[0].innerHTML);
                    }
                }
            }
        } else {
            for (var i = 0; i < panellist[specname].parentNode.childNodes.length; i++) {
                if (panellist[specname].parentNode.childNodes[i].getAttribute('class') == "highcharts-legend") {
                    for (var j = 0; j < panellist[specname].parentNode.childNodes[i].childNodes[0].childNodes.length; j++) {
                        for (var k = 0; k < panellist[specname].parentNode.childNodes[i].childNodes[0].childNodes[j].childNodes[0].childNodes.length; k++) {
                            if (panellist[specname].parentNode.childNodes[i].childNodes[0].childNodes[j].childNodes[0].childNodes[k].nodeName == "text"){
                                actualnames.push(panellist[specname].parentNode.childNodes[i].childNodes[0].childNodes[j].childNodes[0].childNodes[k].childNodes[0].innerHTML);
                            }
                        }
                    }
                }
            }
        }
        
        var tempcheck = [];
        var isrepeat = false;

        for (var k = 0; k < panellist[specname].childNodes.length; k++) {
            for (var j = 0; j < panellist[specname].childNodes[k].childNodes.length; j++) {
                if (panellist[specname].childNodes[k].childNodes[j].getAttribute('fill') != "none") {
                    isrepeat = false;
                    for (var i = 0; i < tempcheck.length; i++) {
                        if (panellist[specname].childNodes[k].childNodes[j].getAttribute('d') == tempcheck[i]) {
                            isrepeat = true;
                        }
                    }
                    if (!isrepeat) {
                        if (doesexist == null || doesexist == undefined) {
                            var option = document.createElement('option');
                            if (actualnames[count] == undefined) {
                                option.text = "Index";
                                option.setAttribute('textname', "Index");
                            } else {
                                option.text = actualnames[count];
                                option.setAttribute('textname', actualnames[count]);
                            }
                            option.value = panellist[specname].childNodes[k].childNodes[j].getAttribute('d');
                            document.getElementById(panelhead).add(option);
                        }
                        count++;
                        tempcheck.push(panellist[specname].childNodes[k].childNodes[j].getAttribute('d'));
                    }
                }
            }
        }

    }

}

function overlayclose() {

    el = document.getElementById("overlay");
    el.style.width = "0%";
    el.style.height = "0%";
    el.style.top = "98%";
    el.style.border = "none";
    document.getElementById('overlaybutton').onclick = overlayopen;
    document.getElementById('overlaybutton').value = "Open";
    document.getElementById('drawstyle').style.visibility = "hidden";
    document.getElementById('canvascolor').style.visibility = "hidden";
    document.getElementById('canvascolor2').style.visibility = "hidden";
    document.getElementById('clearcanvas').style.visibility = "hidden";

}

function overlayopen() {

    el = document.getElementById('overlay');
    el.style.width = "100%";

    if (document.getElementById('overlaysizechange').value == "full") {
        el.style.height = "100%";
        el.style.top = "0%";
    } else {
        el.style.height = "50%";
        el.style.top = "50%";
    }

    el.style.border = "solid";
    document.getElementById('overlaybutton').onclick = overlayclose;
    document.getElementById('overlaybutton').value = "Close";

    if (document.getElementById('mycanvas').style.visibility == "visible") {
        document.getElementById('drawstyle').style.visibility = "visible";
        document.getElementById('drawstyle').style.position = "static";

        if (document.getElementById('drawstyle').value == "gradient") {
            document.getElementById('canvascolor2').style.visibility = "visible";
            document.getElementById('canvascolor2').style.position = "static";
        }

        document.getElementById('clearcanvas').style.visibility = "visible";
        document.getElementById('clearcanvas').style.position = "static";

        document.getElementById('canvasline').style.visibility = "visible";
        document.getElementById('canvasline').style.position = "static";
    }

    document.getElementById('canvascolor').style.visibility = "visible"; 

}

function overlaysize() {

    if (document.getElementById('overlaysizechange').value == "full") {
        var el = document.getElementById('overlay');

        el.style.top = "0";
        el.style.height = "100%";

        document.getElementById('mycanvas').setAttribute("height", "900%");
        document.getElementById('overlaytextbox').style.height = "90%";

    } else {

        var el = document.getElementById('overlay');

        el.style.top = "50%";
        el.style.height = "50%";

        document.getElementById('mycanvas').setAttribute("height", "400%");
        document.getElementById('overlaytextbox').style.height = "80%";

    }

}

function opacitySwitch() {

    document.getElementById('overlay').style.opacity = document.getElementById('opacitylevel').value;

}

function switchVisibility() {

    if (document.getElementById('overlaytextbox').style.visibility == "hidden") {

        if (infobutton) {
            document.getElementById('canvascolor').style.marginLeft = "7%";
        }

        document.getElementById('mycanvas').style.visibility = "hidden";
        document.getElementById('mycanvas').style.position = "fixed";

        document.getElementById('drawstyle').style.visibility = "hidden";
        document.getElementById('drawstyle').style.position = "fixed";

        document.getElementById('canvascolor2').style.visibility = "hidden";
        document.getElementById('canvascolor2').style.position = "fixed";

        document.getElementById('clearcanvas').value = "Clear Text";

        document.getElementById('canvasline').style.visibility = "hidden";
        document.getElementById('canvasline').style.position = "fixed";

        document.getElementById('overlaytextbox').style.visibility = "visible";
        if (document.getElementById('overlaysizechange').value == "full") {
            document.getElementById('overlaytextbox').style.height = "90%";
        } else {
            document.getElementById('overlaytextbox').style.height = "80%";
        }

        document.getElementById('switchbutton').value = "Switch To Canvas";

        if (infobutton) {
            document.getElementById('information').style.position = "fixed";
            if (document.getElementById('mycanvas').style.visibility == "visible") {
                document.getElementById('information').innerHTML = "<center>Canvas Information:</center>The dropdown contains all the different drawing tools.<br>The first color is the main drawing color.<br>The secondary color is used/shown only when required by tool.<br>The Clear Canvas button will clean the canvas.<br>The textbox represents the line width of the tool.<br>The Switch To Textbox boutton will switch the canvas to a textbox.";
            } else {
                document.getElementById('information').innerHTML = "<center>Textbox Information:</center>The color is the font and border color, if it is updated, it will change all the font.<br>The clear button will remove all the text.<br>The Switch To Canvas button will go back to the canvas."
            }
        }

    } else if (document.getElementById('overlaytextbox').style.visibility == "visible") {


        if (infobutton) {
            document.getElementById('canvascolor').style.marginLeft = "10px";
        }

        document.getElementById('mycanvas').style.visibility = "visible";
        document.getElementById('mycanvas').style.position = "static";

        document.getElementById('drawstyle').style.visibility = "visible";
        document.getElementById('drawstyle').style.position = "static";

        if (document.getElementById('drawstyle').value == "gradient") {
            document.getElementById('canvascolor2').style.visibility = "visible";
            document.getElementById('canvascolor2').style.position = "static";
        }

        document.getElementById('clearcanvas').value = "Clear Canvas";

        document.getElementById('canvasline').style.visibility = "visible";
        document.getElementById('canvasline').style.position = "static";

        document.getElementById('overlaytextbox').style.visibility = "hidden";
        document.getElementById('overlaytextbox').style.height = "0%";

        document.getElementById('switchbutton').value = "Switch To Textbox";

        if (infobutton) {
            document.getElementById('information').style.position = "fixed";
            if (document.getElementById('mycanvas').style.visibility == "visible") {
                document.getElementById('information').innerHTML = "<center>Canvas Information:</center>The dropdown contains all the different drawing tools.<br>The first color is the main drawing color.<br>The secondary color is used/shown only when required by tool.<br>The Clear Canvas button will clean the canvas.<br>The textbox represents the line width of the tool.<br>The Switch To Textbox boutton will switch the canvas to a textbox.";
            } else {
                document.getElementById('information').innerHTML = "<center>Textbox Information:</center>The color is the font and border color, if it is updated, it will change all the font.<br>The clear button will remove all the text.<br>The Switch To Canvas button will go back to the canvas."
            }
        }

    }

}

function overlaydrawstylechange(ddel) {

    if (ddel.value == "gradient") {

        document.getElementById('canvascolor2').style.visibility = "visible";
        document.getElementById('canvascolor2').style.position = "static";

    } else {

        document.getElementById('canvascolor2').style.visibility = "hidden";
        document.getElementById('canvascolor2').style.position = "fixed";

    }

}

function ColorLuminance(hex, lum) {

    hex = String(hex).replace(/[^0-9a-f]/gi, '');

    if (hex.length < 6) {

        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

    }

    lum = lum || 0;

    var rgb = "#", c, i;

    for (i = 0; i < 3; i++) {

        c = parseInt(hex.substr(i * 2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);

    }

    return rgb;

}

function generateColor() {

    var color = "#";

    for (i = 0; i < 6; i++) {
        var tempL = Math.random() * 100;
        if (tempL <= 6.25) {
            color = color + "0";
        } else if (tempL <= 12.5) {
            color = color + "1";
        } else if (tempL <= 18.75) {
            color = color + "2";
        } else if (tempL <= 25) {
            color = color + "3";
        } else if (tempL <= 31.25) {
            color = color + "4";
        } else if (tempL <= 37.5) {
            color = color + "5";
        } else if (tempL <= 43.75) {
            color = color + "6";
        } else if (tempL <= 50) {
            color = color + "7";
        } else if (tempL <= 56.25) {
            color = color + "8";
        } else if (tempL <= 62.5) {
            color = color + "9";
        } else if (tempL <= 68.75) {
            color = color + "A";
        } else if (tempL <= 75) {
            color = color + "B";
        } else if (tempL <= 81.25) {
            color = color + "C";
        } else if (tempL <= 87.5) {
            color = color + "D";
        } else if (tempL <= 93.75) {
            color = color + "E";
        } else if (tempL <= 100) {
            color = color + "F";
        }
    }

    return color;

}

function getCssValuePrefix() {
    var rtrnVal = '';
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++) {

        dom.style.background = prefixes[i] + 'liner-gradient(#000000, #ffffff)';

        if (dom.style.background) {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
}

function updatepath2(colorspec, obj) {
    
    var mainColor = colorspec.value;
    
    var uniqueid = document.getElementById(obj).value;
    var path = document.querySelectorAll('path');

    for (var i = 0; i < path.length; i++) {
        if (path[i].getAttribute('fill') != null && path[i].getAttribute('fill') != "none") {
            if (path[i].getAttribute('d') == uniqueid) {
                path[i].style.fill = mainColor;
            }
        }
    }

}

function tableTheme() {

    var c1 = document.getElementById('colorlabel1').innerHTML;
    var c2 = document.getElementById('colorlabel2').innerHTML;

    var selected = document.querySelectorAll('.splunk-paginator a.selected, .splunk-paginator a:hover');
    var tableroweven = document.querySelectorAll('.table-striped>tbody>tr:nth-child(even)>td');
    var tablerowodd = document.querySelectorAll('.table-striped>tbody>tr:nth-child(odd)>td');
    var tablehead = document.querySelectorAll('.table-chrome>thead>tr>th');

    for (var i = 0; i < tablerowodd.length; i++) {
        tablerowodd[i].style.backgroundColor = c2;
        tablerowodd[i].style.borderColor = "#000000";
    }
    for (var i = 0; i < tableroweven.length; i++) {
        tableroweven[i].style.backgroundColor = c1;
        tableroweven[i].style.borderColor = "#000000";
    }
    for (var i = 0; i < tablehead.length; i++) {
        tablehead[i].style.backgroundColor = c1;
        tablehead[i].style.borderColor = "#000000";
    }
    for (var i = 0; i < selected.length; i++) {
        selected[i].style.backgroundColor = c1;
    }

}

function tablecolor() {

    var tcolor = document.getElementById('tablecolor').value;
    var affected = document.querySelectorAll(document.getElementById('tableselect').value);

    for (var i = 0; i < affected.length; i++) {
        affected[i].style.backgroundColor = tcolor;
    }

}

function doespathmatch(path, headname) {

    var parentname = path.parentNode;
    var mxreturn = false;

    if (parentname.getAttribute('id') == "AddData" || parentname.getAttribute('id') == "Page-1") {
        return false;
    }

    while (parentname.getAttribute('class') != "panel-body") {
        parentname = parentname.parentNode;
    }

    parentname = parentname.parentNode.childNodes[0].childNodes;

    for (var i = 0; i < parentname.length; i++) {
        if (parentname[i].nodeName == "H3") {
            if (parentname[i].innerHTML == headname) {
                mxreturn = true;
            }
        }
    }

    return mxreturn;

}

function chartupdate(c1, c2) {

    var chartbg = document.querySelectorAll('.highcharts-background');
    var path = document.querySelectorAll('path');
    var rect = document.querySelectorAll('rect');
    var svg = document.querySelectorAll('text');


    for (var i = 0; i < rect.length; i++) {
        rect[i].style.fill = c1;
    }

    for (var i = 0; i < chartbg.length; i++) {
        chartbg[i].style.fill = c2;
    }

    for (var i = 0; i < path.length; i++) {
        if (path[i].getAttribute('fill') != null && path[i].getAttribute('fill') != "none") {
            var posneg = Math.random();
            if (posneg > 0.5) {
                path[i].style.fill = ColorLuminance(c1, Math.random());
            } else {
                path[i].style.fill = ColorLuminance(c1, -Math.random());
            }
        } else if (path[i].getAttribute('fill') == "none") {
            path[i].style.stroke = ColorLuminance(c1, Math.random());
        }
    }

    for (var i = 0; i < svg.length; i++) {
        svg[i].style.fill = c1;
    }

}

function blueprintTheme(c1, c2) {

    var selected = document.querySelectorAll('.splunk-paginator a.selected, .splunk-paginator a:hover');
    var tableroweven = document.querySelectorAll('.table-striped>tbody>tr:nth-child(even)>td');
    var tablerowodd = document.querySelectorAll('.table-striped>tbody>tr:nth-child(odd)>td');
    var tablehead = document.querySelectorAll('.table-chrome>thead>tr>th');
    var chartbg = document.querySelectorAll('.highcharts-background');
    var cblocks = document.getElementsByClassName('cblocks');
    var elements = document.querySelectorAll('.app-bar');
    var inputs = document.querySelectorAll('select');
    var path = document.querySelectorAll('path');
    var rect = document.querySelectorAll('rect');
    var svg = document.querySelectorAll('text');
    var alinks = document.querySelectorAll('a');

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.backgroundColor = c2;
    }

    if (document.getElementById('changecontent').checked) {
        document.getElementById('content').style.backgroundColor = "transparent";
    } else {
        document.getElementById('content').style.backgroundColor = "white";
    }
    elements[0].style.backgroundColor = c1;
    if (!document.getElementById('tablelock').checked) {
        for (var i = 0; i < tablerowodd.length; i++) {
            tablerowodd[i].style.backgroundColor = c2;
            tablerowodd[i].style.borderColor = "#000000";
        }
        for (var i = 0; i < tableroweven.length; i++) {
            tableroweven[i].style.backgroundColor = c1;
            tableroweven[i].style.borderColor = "#000000";
        }
        for (var i = 0; i < tablehead.length; i++) {
            tablehead[i].style.backgroundColor = c1;
            tablehead[i].style.borderColor = "#000000";
        }
    }
    for (var i = 0; i < rect.length; i++) {
        var paffect = true;
        for (var j = 0; j < cblocks.length; j++) {
            if (cblocks[j].checked) {
                if (doespathmatch(rect[i], cblocks[j].getAttribute('name'))) {
                    paffect = false;
                }
            }
        }
        if (paffect) {
            rect[i].style.fill = c1;
        }
    }
    for (var i = 0; i < chartbg.length; i++) {
        var paffect = true;
        for (var j = 0; j < cblocks.length; j++) {
            if (cblocks[j].checked) {
                if (doespathmatch(chartbg[i], cblocks[j].getAttribute('name'))) {
                    paffect = false;
                }
            }
        }
        if (paffect) {
            chartbg[i].style.fill = c2;
        }
    }
    for (var i = 0; i < path.length; i++) {
        if (path[i].getAttribute('fill') != null && path[i].getAttribute('fill') != "none") {
            var paffect = true;
            for (var j = 0; j < cblocks.length; j++) {
                if (cblocks[j].checked) {
                    if (doespathmatch(path[i], cblocks[j].getAttribute('name'))) {
                        paffect = false;
                    }
                }
            }
            if (paffect) {
                var posneg = Math.random();
                if (posneg > 0.5) {
                    path[i].style.fill = ColorLuminance(c1, Math.random());
                } else {
                    path[i].style.fill = ColorLuminance(c1, -Math.random());
                }
            }
        } else if (path[i].getAttribute('fill') == "none") {
            var paffect = true;
            for (var j = 0; j < cblocks.length; j++) {
                if (cblocks[j].checked) {
                    if (doespathmatch(path[i], cblocks[j].getAttribute('name'))) {
                        paffect = false;
                    }
                }
            }
            if (paffect) {
                path[i].style.stroke = ColorLuminance(c1, Math.random());
            }
        }
    }
    for (var i = 0; i < svg.length; i++) {
        var paffect = true;
        for (var j = 0; j < cblocks.length; j++) {
            if (cblocks[j].checked) {
                if (doespathmatch(svg[i], cblocks[j].getAttribute('name'))) {
                    paffect = false;
                }
            }
        }
        if (paffect) {
            svg[i].style.fill = c1;
        }
    }
    for (var i = 0; i < selected.length; i++) {
        selected[i].style.backgroundColor = c1;
    }
    document.getElementById('overlay').style.backgroundColor = c1;
    document.getElementById('overlay').style.color = c2;
    document.getElementById('overlay').style.borderColor = c2;
    document.getElementById('drawstyle').style.backgroundColor = c2;
    document.getElementById('overlaysizechange').style.backgroundColor = c2;
    document.getElementById('opacitylevel').style.backgroundColor = c2;
    document.getElementById('uniqueidselect').style.backgroundColor = c1;
    document.getElementById('accordionli').style.backgroundColor = c2;
    document.getElementById('accordionli2').style.backgroundColor = c2;
    document.getElementById('T1D3').style.backgroundColor = c1;
    document.getElementById('colorlabel1').innerHTML = c1;
    document.getElementById('T1D4').style.backgroundColor = c2;
    document.getElementById('colorlabel2').innerHTML = c2;
    document.getElementById('bg').style.backgroundImage = getCssValuePrefix() + 'linear-gradient(' + c1 + ' 10%, ' + c2 +')';
    document.getElementById('input2').style.backgroundColor = c1;
    document.getElementById('cone').value = c1;
    document.getElementById('ctwo').value = c2;
    document.getElementById('ncolor').value = c1;

}

function hexToRgb(hex) {

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorTheme() {

    if (document.getElementById('input2').value == "#BB3B23") {
        blueprintTheme("#BB3B23", "#000000");
    } else if (document.getElementById('input2').value == "#D3491E") {
        blueprintTheme("#D3491E", "#EECB47");
    } else if (document.getElementById('input2').value == "#456FFB") {
        blueprintTheme("#456FFB", "#021330");
    } else if (document.getElementById('input2').value == "other") {
        console.log('Trolololololol');
    } else {
        blueprintTheme(ColorLuminance(document.getElementById('input2').value, 0.3), ColorLuminance(document.getElementById('input2').value, -0.3));
    }

}

function colorLum() {

    blueprintTheme(ColorLuminance(document.getElementById('ncolor').value, document.getElementById('light').value), ColorLuminance(document.getElementById('ncolor').value, document.getElementById('dark').value));

    document.getElementById('input2').selectedIndex = "6";

}

function colorBlend() {

    blueprintTheme(document.getElementById('cone').value, document.getElementById('ctwo').value);

    document.getElementById('input2').selectedIndex = "6";

}

function randomColor() {

    var mainColor = generateColor();

    blueprintTheme(ColorLuminance(mainColor, Math.random()), ColorLuminance(mainColor, -Math.random()));

    document.getElementById('input2').selectedIndex = "6";

}

function showhide(show) {

    document.getElementById('ali1').style.display = "none";
    document.getElementById('ali2').style.display = "none";
    document.getElementById(show).style.display = "block";

    if (show == "ali1") {
        document.getElementById('cen1').innerHTML = "v Table 1 v";
        document.getElementById('cen2').innerHTML = "> Table 2 <";
    } else {
        document.getElementById('cen1').innerHTML = "> Table 1 <";
        document.getElementById('cen2').innerHTML = "v Table 2 v";
    }

}

/**var origin = [];
var setvals = [];

function resetPie() {

    var paths = document.querySelectorAll('path');
    var count = 0;

    for (var i = 0; i < paths.length; i++) {

        if (paths[i].getAttribute('fill') != null && paths[i].getAttribute('fill') != "none") {
            count++;
            if (count >= 5 && count < 15) {

                paths[i].setAttribute('d', origin[count - 5]);

            }

        }

    }    

}

function order() {

    var paths = document.querySelectorAll('path');
    var count = 0;
    var arealist = [];
    for (var i = 0; i < paths.length; i++) {

        if (paths[i].getAttribute('fill') != null && paths[i].getAttribute('fill') != "none") {
            count++;
            if (count >= 5 && count < 15) {

                origin.push(paths[i].getAttribute('d'));

                var lastplace = 0;
                var pname = paths[i].getAttribute('d');
                var x1 = x2 = x3 = y1 = y2 = y3 = 0;
                var tempn = 0;

                        x1 = pname.substr(2, pname.indexOf(" ", 3) - 2);
                        tempn = pname.indexOf(" ", 0 + 2);
                        y1 = pname.substr(tempn + pname.indexOf(" ", 0), pname.indexOf(" ", pname.indexOf(" ", 2)) - 3);
                        tempn = pname.indexOf("A");
                        lastplace = pname.indexOf(" ", tempn + 2);
                        lastplace = pname.indexOf(" ", lastplace + 1);
                        lastplace = pname.indexOf(" ", lastplace + 1);
                        lastplace = pname.indexOf(" ", lastplace + 1);
                        lastplace = pname.indexOf(" ", lastplace + 1);
                        x2 = pname.substr(tempn + (lastplace - tempn) + 1, lastplace - (tempn + 6));
                        lastplace = pname.indexOf(" ", lastplace + 1);
                        y2 = pname.substr(tempn + (lastplace - tempn) + 1, lastplace - (tempn + 22));
                        tempn = pname.indexOf("L") + 2;
                        x3 = pname.substr(tempn, pname.indexOf(" ", tempn + 1) - tempn);
                        tempn = pname.indexOf(" ", tempn + x3.length) + 1;
                        y3 = pname.substr(tempn, pname.indexOf(" ", tempn + 1) - tempn);

                        tarea = ((x1 * (y2 - y3)) + (x2 * (y3 - y1)) + (x3 * (y1 - y2))) / 2;

                        arealist.push(tarea);
                        setvals.push(x1);
                        setvals.push(y1);
                        setvals.push(x2);
                        setvals.push(y2);
                        setvals.push(x3);
                        setvals.push(y3);
            }

        }

    }

    var mamount = 0;
    count = 0;

    for (var i = 0; i < arealist.length; i++) {
        mamount = mamount + arealist[i];
    }

    for (var i = 0; i < paths.length; i++) {

        if (paths[i].getAttribute('fill') != null && paths[i].getAttribute('fill') != "none") {
            count++;
            if (count >= 5 && count < 15) {

                heightpercent = arealist[count - 5] / mamount;

                var temph = heightpercent * 600;
                paths[i].setAttribute("d", "M" + ((count - 5) * 50) + "," + 0 + " L" + ((count - 4) * 50) + "," + 0 + " L" + ((count - 4) * 50) + "," + temph + " L" + ((count - 5) * 50) + "," + temph + "  Z");

            }

        }

    }

}**/
