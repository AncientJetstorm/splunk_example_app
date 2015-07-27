var count = document.getElementsByTagName('a');
alert(count.length);
for (var i = 0; i < count.length; i++) {
    count[i].onclick = function(){
          return false;
    }
}