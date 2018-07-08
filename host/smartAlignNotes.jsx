var thisDoc = app.documents[0];
var activeAB = thisDoc.artboards.getActiveArtboardIndex();
var lastAB = 0;
var lastABOffset;

// alert(thisDoc.artboards[thisDoc.artboards.getActiveArtboardIndex()].artboardRect);
// alert(app.selection[0].geometricBounds)
// alert(app.selection[0].position)

function scanCurrentArtboard(){
  activeAB = thisDoc.artboards.getActiveArtboardIndex();
  if (activeAB !== lastAB)
    return activeAB;
  else
    return lastAB;
  lastAB = activeAB;
}

var absAB, relAB;

function updateArtboardDimensions(index){
  var w, h;
  absAB = thisDoc.artboards[index].artboardRect;
  relAB = [];
  absAB[1] = (absAB[1] * (-1));
  for (var inv = 0; inv < 4; inv++) {
    res = (absAB[inv] < 0) ? (absAB[inv] * (-1)) : absAB[inv];
    relAB.push(roundTo(res, 4));
  }
  // alert(absAB + "\r" + relAB)

  if (absAB[0] < 0)
    w = (absAB[0] - relAB[2]);
  else
    w = (relAB[0] - relAB[2]);

  if (absAB[1] < 0)
    h = (absAB[1] - absAB[3]);
  else
    h = (relAB[1] - relAB[3]);

  w = (w < 0) ? (w*(-1)) : w;
  h = (h < 0) ? (h*(-1)) : h;
  lastABOffset = [ parseInt((absAB[0] * -1)), parseInt((absAB[1] * -1)) ]
  return rect = [ absAB[0], absAB[1], w, h ];
}



/** modified from Alexander Ladygin:
https://forums.adobe.com/thread/2109761  **/
function getBounds(arr, bounds) {
    var x1 = [], y1 = [], x2 = [], y2 = [],
        bounds = bounds || 'geometricBounds';
    for (var i = 0; i < arr.length; i++) {
      // var shadowSelect = [];
      // for (var inv = 0; inv < 4; inv++) {
      //   var res = arr[i][bounds][inv];
      //   res = (res < 0) ? (res * (-1)) : res;
      //   shadowSelect.push(roundTo(res, 4));
      // }
      // alert(arr[i][bounds][0])
      // alert("Stop")
      if (arr[i][bounds][0] > 0) {
        x1.push(lastABOffset[0] + arr[i][bounds][0]);
        x2.push(lastABOffset[0] + arr[i][bounds][2]);
      } else {
        alert('x1:' + x1 + '\r x2:' + x2 + '\r offset:' + lastABOffset[0] + '\r x1b:' + arr[i][bounds][0] + '\r x2b:' + arr[i][bounds][2] )
        x1.push((arr[i][bounds][0] - lastABOffset[0]));
        x2.push(arr[i][bounds][2] - lastABOffset[0]);
      }
      if (absAB[1] > 0) {
        y1.push(arr[i][bounds][1] + lastABOffset[1]);
        y2.push(arr[i][bounds][3] + lastABOffset[1]);
      } else {
        y1.push(arr[i][bounds][1] - lastABOffset[1]);
        y2.push(arr[i][bounds][3] - lastABOffset[1]);
      }
    }

    // find lowest and highest values in above arrays to create selection bounds:
    x1 = Math.min.apply(null, x1);
    y1 = Math.min.apply(null, y1);
    x2 = Math.max.apply(null, x2);
    y2 = Math.max.apply(null, y2);

    // width is maximum X - minimum X, height same with Y
    w = x2 - x1;
    h = y2 - y1;
    return rect = [ x1, y1, x2, y2, w, h ];
};


function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}