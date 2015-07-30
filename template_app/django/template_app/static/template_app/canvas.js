var el = document.getElementById('mycanvas');
var ctx = el.getContext('2d');

ctx.lineWidth = 10;
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, points = [ ];
var lastPoint;
var clientX, clientY, timeout;
var density = 50;
var rgbsegment = { r: 255, g: 0, b: 0 };
var rgbflip = true;
var rvote = false;
var gvote = false;
var bvote = false;

var colored = setInterval(temperet, 4800);

function timedtheme() {

    colored = setInterval(temperet2, 2400);

}

function temperet2() {

    blueprintTheme(document.getElementById('colorlabel1').innerHTML, document.getElementById('colorlabel2').innerHTML);
    window.clearInterval(colored);

    var child1 = document.getElementsByClassName("search-button btn-pill");
    var child2 = document.getElementsByClassName("export-button btn-pill");
    var child3 = document.getElementsByClassName("inspect-button btn-pill");
    var child4 = document.getElementsByClassName("refresh-button btn-pill");
    var parent = child1[0].parentNode;

    parent.removeChild(child1[0]);
    parent.removeChild(child2[0]);
    parent.removeChild(child3[0]);
    parent.removeChild(child4[0]);

}

function temperet() {

    colorTheme();
    window.clearInterval(colored);

    var aparse = document.querySelectorAll('a');

    for (var i = 0; i < aparse.length; i++) {
        aparse[i].setAttribute('onclick', "timeColor()");
    }
    var parent = document.getElementsByClassName("view-results pull-left splunk-view");
    var child1 = document.getElementsByClassName("search-button btn-pill");
    var child2 = document.getElementsByClassName("export-button btn-pill");
    var child3 = document.getElementsByClassName("inspect-button btn-pill");
    var child4 = document.getElementsByClassName("refresh-button btn-pill");

    for (var i = parent.length - 1; i > -1; i--) {
        if (parent[i].childNodes[0] != null) {
            parent[i].removeChild(child1[i]);
            parent[i].removeChild(child2[i]);
            parent[i].removeChild(child3[i]);
            parent[i].removeChild(child4[i]);
        }
    }

    testPanel();
    updatepaths2();

}

function timeColor() {

    colored = setInterval(testingcolor, 120);

}

function testingcolor() {

    tableTheme();
    window.clearInterval(colored);

    var aparse = document.querySelectorAll('a');

    for (var i = 0; i < aparse.length; i++) {
        aparse[i].setAttribute('onclick', "timeColor()");
    }

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

el.onmousedown = function(e) {
  isDrawing = true;

  if (document.getElementById('drawstyle').value == 'sprayrect' || document.getElementById('drawstyle').value == 'spraycirc') {
      ctx.lineJoin = ctx.lineCap = 'round';
      clientX = getMousePos(null, e).x;
      clientY = getMousePos(null, e).y;
      ctx.fillStyle = document.getElementById('canvascolor').value;
      timeout = setTimeout(function draw() {
        if (document.getElementById('drawstyle').value == 'sprayrect') {
            for (var i = density; i--; ) {
              var radius = 30;
              var offsetX = getRandomInt(-radius, radius);
              var offsetY = getRandomInt(-radius, radius);
              ctx.fillRect(clientX + offsetX, clientY + offsetY, 1, 1);
            }
        } else {
            for (var i = density; i--; ) {
              var angle = getRandomFloat(0, Math.PI*2);
              var radius = getRandomFloat(0, 20);
              ctx.fillRect(
                clientX + radius * Math.cos(angle),
                clientY + radius * Math.sin(angle), 
                1, 1);
            }
        }
        if (!timeout) return;
        timeout = setTimeout(draw, 50);
      }, 50);
  } else {
    points = [ ];
    points.push({ x: getMousePos(null, e).x, y: getMousePos(null, e).y });
    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y };
  }
};

el.onmousemove = function(e) {
  if (!isDrawing) return;

  ctx.lineWidth = document.getElementById('canvasline').value;
  var line = document.getElementById('canvasline').value;
  ctx.strokeStyle = document.getElementById('canvascolor').value;
  ctx.fillStyle = document.getElementById('canvascolor2').value;
  origincolor = hexToRgb(document.getElementById('canvascolor').value);
  origincolor2 = hexToRgb(document.getElementById('canvascolor2').value);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  points.push({ x: getMousePos(null, e).x, y: getMousePos(null, e).y });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  if (document.getElementById('drawstyle').value == 'sketch') {

    ctx.beginPath();
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    for (var i = 0, len = points.length; i < len; i++) {
      dx = points[i].x - points[points.length-1].x;
      dy = points[i].y - points[points.length-1].y;
      d = dx * dx + dy * dy;

      if (d < 1000) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + origincolor.r + ', ' + origincolor.g + ', ' + origincolor.b + ', 0.3)';
        ctx.moveTo( points[points.length-1].x + (dx * 0.2), points[points.length-1].y + (dy * 0.2));
        ctx.lineTo( points[i].x - (dx * 0.2), points[i].y - (dy * 0.2));
        ctx.stroke();
      }
    }

  } else if (document.getElementById('drawstyle').value == 'flowsketch') {

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y);
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();
    ctx.closePath();

    for (var i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.globalAlpha = 1 - (i * 0.1);
        ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y + ((1 * i) * document.getElementById('canvasline').value));
        ctx.lineTo(lastPoint.x, lastPoint.y + ((1 * i) * document.getElementById('canvasline').value));
        ctx.stroke();
        ctx.closePath();
    }

    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y };

  } else if (document.getElementById('drawstyle').value == 'rainbowsketch') {

    if (rgbsegment.r == 255 && rgbsegment.g < 255 && rgbsegment.b == 0) {
        rgbsegment.g += 5;
    } else if (rgbsegment.r > 0 && rgbsegment.g == 255 && rgbsegment.b == 0) {
        rgbsegment.r -= 5;
    } else if (rgbsegment.r == 0 && rgbsegment.g == 255 && rgbsegment.b < 255) {
        rgbsegment.b += 5;
    } else if (rgbsegment.r == 0 && rgbsegment.g > 0 && rgbsegment.b == 255) {
        rgbsegment.g -= 5;
    } else if (rgbsegment.r < 255 && rgbsegment.g == 0 && rgbsegment.b == 255) {
        rgbsegment.r += 5;
    } else if (rgbsegment.r == 255 && rgbsegment.g == 0 && rgbsegment.b > 0) {
        rgbsegment.b -= 5;
    } else {
        rgbsegment.r = 255;
        rgbsegment.g = 0;
        rgbsegment.b = 0;
    }

    ctx.strokeStyle = "rgb(" + rgbsegment.r + ", " + rgbsegment.g + ", " + rgbsegment.b + ")";

    ctx.beginPath();
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    for (var i = 0, len = points.length; i < len; i++) {
      dx = points[i].x - points[points.length-1].x;
      dy = points[i].y - points[points.length-1].y;
      d = dx * dx + dy * dy;

      if (d < 1000) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + rgbsegment.r + ', ' + rgbsegment.g + ', ' + rgbsegment.b + ', 0.3)';
        ctx.moveTo( points[points.length-1].x + (dx * 0.2), points[points.length-1].y + (dy * 0.2));
        ctx.lineTo( points[i].x - (dx * 0.2), points[i].y - (dy * 0.2));
        ctx.stroke();
      }
    }
    
  } else if (document.getElementById('drawstyle').value == 'gradient') {

    if (origincolor.r == origincolor2.r) {
        rgbsegment.r = origincolor.r;
        rvote = true;
    } else if (origincolor.r < origincolor2.r) {
        if (rgbflip && rgbsegment.r < origincolor2.r) {
            rgbsegment.r += 1;
            if (rgbsegment.r == origincolor2.r) {
                rvote = true;
            }
        } else if (!rgbflip && rgbsegment.r > origincolor.r) {
            rgbsegment.r -= 1;
            if (rgbsegment.r == origincolor.r) {
                rvote = true;
            }
        }
    } else if (origincolor.r > origincolor2.r) {
        if (rgbflip && rgbsegment.r > origincolor2.r) {
            rgbsegment.r -= 1;
            if (rgbsegment.r == origincolor2.r) {
                rvote = true;
            }
        } else if (!rgbflip && rgbsegment.r < origincolor.r) {
            rgbsegment.r += 1;
            if (rgbsegment.r == origincolor.r) {
                rvote = true;
            }
        }
    }

    if (origincolor.g == origincolor2.g) {
        rgbsegment.g = origincolor.g;
        gvote = true;
    } else if (origincolor.g < origincolor2.g) {
        if (rgbflip && rgbsegment.g < origincolor2.g) {
            rgbsegment.g += 1;
            if (rgbsegment.g == origincolor2.g) {
                gvote = true;
            }
        } else if (!rgbflip && rgbsegment.g > origincolor.g) {
            rgbsegment.g -= 1;
            if (rgbsegment.g == origincolor.g) {
                gvote = true;
            }
        }
    } else if (origincolor.g > origincolor2.g) {
        if (rgbflip && rgbsegment.g > origincolor2.g) {
            rgbsegment.g -= 1;
            if (rgbsegment.g == origincolor2.g) {
                gvote = true;
            }
        } else if (!rgbflip && rgbsegment.g < origincolor.g) {
            rgbsegment.g += 1;
            if (rgbsegment.g == origincolor.g) {
                gvote = true;
            }
        }
    }

    if (origincolor.b == origincolor2.b) {
        rgbsegment.b = origincolor.b;
        bvote = true;
    } else if (origincolor.b < origincolor2.b) {
        if (rgbflip && rgbsegment.b < origincolor2.b) {
            rgbsegment.b += 1;
            if (rgbsegment.b == origincolor2.b) {
                bvote = true;
            }
        } else if (!rgbflip && rgbsegment.b > origincolor.b) {
            rgbsegment.b -= 1;
            if (rgbsegment.b == origincolor.b) {
                bvote = true;
            }
        }
    } else if (origincolor.b > origincolor2.b) {
        if (rgbflip && rgbsegment.b > origincolor2.b) {
            rgbsegment.b -= 1;
            if (rgbsegment.b == origincolor2.b) {
                bvote = true;
            }
        } else if (!rgbflip && rgbsegment.b < origincolor.b) {
            rgbsegment.b += 1;
            if (rgbsegment.b == origincolor.b) {
                bvote = true;
            }
        }
    }

    if (rvote && gvote && bvote) {
        if (rgbflip) {
            rgbflip = false;
        } else {
            rgbflip = true;
        }
        rvote = false;
        gvote = false;
        bvote = false;
    }

    ctx.strokeStyle = "rgb(" + rgbsegment.r + ", " + rgbsegment.g + ", " + rgbsegment.b + ")";

    ctx.beginPath();
    ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y);
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();

    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y };

  } else if (document.getElementById('drawstyle').value == 'pencil') {

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

  } else if (document.getElementById('drawstyle').value == 'deltapencil') {

    ctx.beginPath();
    ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y);
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();
    ctx.closePath();
    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y }

  } else if (document.getElementById('drawstyle').value == 'fade') {

    ctx.shadowBlur = 10;
    ctx.shadowColor = document.getElementById('canvascolor').value;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke(); 

  } else if (document.getElementById('drawstyle').value == "flowrectangle") {

    for (var i = 0; i < points.length; i++) {
      if (i < points.length - 1) {
        ctx.beginPath();
        var rectdia = getMidPoint(points[i], points[i + 1]);
        var rectradius = getDistance(points[i], rectdia) * 2;
        ctx.rect(points[i].x, points[i].y, rectradius, rectradius);
        ctx.stroke();
        ctx.closePath();
      }
    }

  } else if (document.getElementById('drawstyle').value == "flowcircle") {

    for (var i = 0; i < points.length; i++) {
      if (i < points.length - 1) {
        ctx.beginPath();
        var arcdia = getMidPoint(points[i], points[i + 1]);
        var arcradius = getDistance(points[i], arcdia);
        var arcangle = getAngle(points[i], points[i + 1]);
        ctx.arc(arcdia.x, arcdia.y, arcradius, arcangle, arcangle + 360);
        ctx.stroke();
        ctx.closePath();
      }
    }

  } else if (document.getElementById('drawstyle').value == 'highlight') {

    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y);
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();
    ctx.closePath();
    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y }

  } else if (document.getElementById('drawstyle').value == 'flair') {

    ctx.drawstyle = "black";
    ctx.fillStyle = document.getElementById('canvascolor');

    /**for (var i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i].x - 1, points[i].y - 1);
        ctx.stroke();
        ctx.closePath();
    }**/

    var seccolor = hexToRgb(document.getElementById('canvascolor2').value);
    ctx.lineWidth = 1;
    var radius = Math.floor(Math.random() * document.getElementById('canvasline').value);

    //for (var i = 0; i < points.length; i++) {

        ctx.strokeStyle = "rgba(" + origincolor.r + ", " + origincolor.g + ", " + origincolor.b + ", " + (Math.random() * 250) + ")";
        ctx.fillStyle = "rgba(" + seccolor.r + ", " + seccolor.g + ", " + seccolor.b + ", " + (Math.random() * 250) + ")";
        ctx.globalAlpha = Math.random();

        ctx.beginPath();
        //ctx.arc(points[i].x, points[i].y, Math.floor(Math.random() * 10), false, Math.PI * 2, false);
        //ctx.arc(points[i].x, points[i].y, radius, false, Math.PI * 2, false);
        ctx.arc(getMousePos(null, e).x, getMousePos(null, e).y, radius, false, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
    //}

  } else if (document.getElementById('drawstyle').value == 'pen') {

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.9;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 1);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.8;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 2);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.7;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 3);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.6;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 4);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 5);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.4;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 6);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 0.3;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y - 7);
    }
    ctx.stroke();
    ctx.closePath();

  } else if (document.getElementById('drawstyle').value == 'rainbow') {

    if (rgbsegment.r == 255 && rgbsegment.g < 255 && rgbsegment.b == 0) {
        rgbsegment.g += 5;
    } else if (rgbsegment.r > 0 && rgbsegment.g == 255 && rgbsegment.b == 0) {
        rgbsegment.r -= 5;
    } else if (rgbsegment.r == 0 && rgbsegment.g == 255 && rgbsegment.b < 255) {
        rgbsegment.b += 5;
    } else if (rgbsegment.r == 0 && rgbsegment.g > 0 && rgbsegment.b == 255) {
        rgbsegment.g -= 5;
    } else if (rgbsegment.r < 255 && rgbsegment.g == 0 && rgbsegment.b == 255) {
        rgbsegment.r += 5;
    } else if (rgbsegment.r == 255 && rgbsegment.g == 0 && rgbsegment.b > 0) {
        rgbsegment.b -= 5;
    } else {
        rgbsegment.r = 255;
        rgbsegment.g = 0;
        rgbsegment.b = 0;
    }

    ctx.strokeStyle = "rgb(" + rgbsegment.r + ", " + rgbsegment.g + ", " + rgbsegment.b + ")";

    ctx.beginPath();
    ctx.moveTo(getMousePos(null, e).x, getMousePos(null, e).y);
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();

    lastPoint = { x: getMousePos(null, e).x, y: getMousePos(null, e).y };

  } else if (document.getElementById('drawstyle').value == 'sprayrect' || document.getElementById('drawstyle').value == 'spraycirc') {

    clientX = getMousePos(null, e).x;
    clientY = getMousePos(null, e).y;

  } else if (document.getElementById('drawstyle').value == 'eraser') {

    ctx.strokeStyle = 'white';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

  }
  
};

function getDistance(p1, p2) {

    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));

}

function getMidPoint(p1, p2) {

    return { x: ((p1.x + p2.x) / 2), y: ((p1.y + p2.y) / 2) };

}

function getAngle(originpoint, nextpoint) {
    var angle = Math.atan2(nextpoint.x - originpoint.x, nextpoint.y - originpoint.y);

    if(angle < 0) {
        angle += 360;
    }

    return angle;
}

el.onmouseup = function() {
  isDrawing = false;
  clearTimeout(timeout);
  points.length = 0;
};

function getMousePos(canvas, evt) {

    var canvas = document.getElementById('mycanvas');

    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
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

function overlaycolorchange() {

    if (document.getElementById('mycanvas').style.visibility == "hidden") {
        document.getElementById('overlaytextbox').style.color = document.getElementById('canvascolor').value;
    } else {
        var disc = hexToRgb(document.getElementById('canvascolor').value);
        rgbsegment.r = disc.r;
        rgbsegment.g = disc.g;
        rgbsegment.b = disc.b;
    }

}

function clearcanvas(obj) {

    var canvas = document.getElementById('mycanvas');

    if (canvas.style.visibility == "visible") {
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        document.getElementById('overlaytextbox').value = "";
    }

}
