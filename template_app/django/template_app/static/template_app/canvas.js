var el = document.getElementById('mycanvas');
var ctx = el.getContext('2d');

ctx.lineWidth = 10;
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, points = [ ];
var lastPoint;
var clientX, clientY, timeout;
var density = 50;

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
  origincolor = hexToRgb(document.getElementById('canvascolor').value);
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

  } else if (document.getElementById('drawstyle').value == 'pencil') {

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

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

  } else if (document.getElementById('drawstyle').value == 'flair') {

    ctx.beginPath();
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(' + origincolor.r + ', ' + origincolor.g + ', ' + origincolor.b + ', 0.3)';
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x - 5, points[points.length - 1].y - 10);
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x + 5, points[points.length - 1].y + 10);
    ctx.stroke();

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

  } else if (document.getElementById('drawstyle').value == 'other') {

    var updown = Math.random();
    var leftright = Math.random();
    if (updown > 0.5) {
        if (leftright > 0.5) {
            points.push({ x: (getMousePos(null, e).x - (Math.random() * (10 * line))), y: (getMousePos(null, e).y - (Math.random() * (10 * line))) });
        } else {
            points.push({ x: (getMousePos(null, e).x + (Math.random() * (10 * line))), y: (getMousePos(null, e).y - (Math.random() * (10 * line))) });
        }
    } else {
        if (leftright > 0.5) {
            points.push({ x: (getMousePos(null, e).x - (Math.random() * (10 * line))), y: (getMousePos(null, e).y + (Math.random() * (10 * line))) });
        } else {
            points.push({ x: (getMousePos(null, e).x + (Math.random() * (10 * line))), y: (getMousePos(null, e).y + (Math.random() * (10 * line))) });
        }
    }
    points.push({ x: getMousePos(null, e).x, y: getMousePos(null, e).y });

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

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

function breakdb() {

    for (var i = 0; i < 50; i++) {
        drawball();
    }

}

function drawball() {

    var canvas = document.getElementById('mycanvas');

    ctx.lineWidth = 1;
    var rx = (Math.random() * canvas.width);
    var ry = (Math.random() * canvas.height);
    var tempC = generateColor();

    //var grd = ctx.createRadialGradient(80, 55, 5, 90, 60, 100);
    var grd = ctx.createRadialGradient(rx, ry, 5, rx + 10, ry + 5, 100);
    //grd.addColorStop(0, ColorLuminance(document.getElementById('canvascolor').value, 1.5));
    //grd.addColorStop(1, ColorLuminance(document.getElementById('canvascolor').value, -1.5));
    grd.addColorStop(0, ColorLuminance(tempC, 1.5));
    grd.addColorStop(1, ColorLuminance(tempC, -1.5));
    //grd.addColorStop(0, 'rgb(250, 120, 120)');
    //grd.addColorStop(0.2, 'rgb(230, 70, 70)');
    //grd.addColorStop(0.8, 'rgb(100, 0, 0)');
    //grd.addColorStop(1, 'rgb(70, 0, 0)');
    ctx.strokeStyle = grd;
    ctx.beginPath();
    //ctx.arc(100,75,50,0,2*Math.PI);
    ctx.shadowBlur = 20;
    ctx.shadowColor="black";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.arc(rx + 20, ry + 20, 50, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = grd;
    ctx.fill();

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

function clearcanvas(obj) {

    var canvas = document.getElementById('mycanvas');

    if (canvas.style.visibility == "visible") {
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        document.getElementById('overlaytextbox').value = "";
    }

}

function testdraw(event, obj) {

    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');

    var viewportOffset = obj.getBoundingClientRect();

    var top = viewportOffset.top;
    var left = viewportOffset.left;

    var x = event.clientX - left;
    var y = event.clientY - top;

    context.strokeStyle = document.getElementById('canvascolor').value;
    context.fillStyle = document.getElementById('canvascolor2').value;
    context.beginPath();

    for (var i = 0; i < setvals.length / 2; i++) {
        if (i == 0) {

            context.moveTo(setvals[i], setvals[i + 1]);

        } else if (i == 1) {

            context.lineTo(setvals[i + 1], setvals[i + 2], 1, 0, 0);
            context.stroke();

        } else {

            context.lineTo(setvals[i * 2], setvals[(i * 2) + 1]);
            context.fill();
            context.stroke();

        }
    }

}
