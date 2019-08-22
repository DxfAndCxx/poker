function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


var g = {}

g.id = getAllUrlParams().id
g.status = 0


var width = window.innerWidth;
var height = window.innerHeight;

//var width = 700;
//var height = 400;

g.win_width = width
g.win_height = height;

g.item_width = 50;
g.item_height = 90;
g.level = {}


var stage = new Konva.Stage({ container: 'container', width: width, height: height });

var layer = new Konva.Layer();


var show0 = new Konva.Group({ x: g.win_width/2, y: g.win_height - g.item_height * 2 - 40, });
var show1 = new Konva.Group({ x: g.win_width, y: (g.win_height - g.item_height)/2, });
var show2 = new Konva.Group({ x: g.win_width/2, y: 0, });
var show3 = new Konva.Group({ x: 0, y: (g.win_height - g.item_height)/2, });
var main = new Konva.Group({ x: g.win_width/2, y: g.win_height - g.item_height -20, });

show0._name = 0
show1._name = 1
show2._name = 2
show3._name = 3
main._name = 'mine'

g.button = mk_button(function(){
    if (0 == g.status)
    {
        option_post()
        return;
    }
})

layer.add(g.button)

g.pokers_mine = main
g.pokers_show0 = show0
g.pokers_show1 = show1
g.pokers_show2 = show2
g.pokers_show3 = show3

layer.add(show0);
layer.add(show1);
layer.add(show2);
layer.add(show3);
layer.add(main);


// add the layer to the stage

g.msg = new Konva.Text({
    x: 0,
    y: 0,
    text: "",
    fontSize: 30,
    fontFamily: 'Calibri',
});

layer.add(g.msg)

g.layer = layer

stage.add(layer);

msg_show("welcome")

ws_init()


