var thisDoc = app.documents[0];
var activeAB = thisDoc.artboards.getActiveArtboardIndex();
var lastAB = 0;
var lastABOffset, isOrigin, thisAB, absAB, relAB;

// alert(thisDoc.artboards[thisDoc.artboards.getActiveArtboardIndex()].artboardRect);
// alert(app.selection[0].geometricBounds)
// alert(app.selection[0].position)

function scanCurrentArtboard(){
  activeAB = thisDoc.artboards.getActiveArtboardIndex();
  (activeAB !== lastAB) ? return activeAB : return lastAB;
  lastAB = activeAB;
}

function updateArtboardDimensions(index){
  var w, h;
  thisAB = thisDoc.artboards.getActiveArtboardIndex();
  absAB = thisDoc.artboards[index].artboardRect;
  relAB = [];
  absAB[1] = (absAB[1] * (-1));
  // absAB
  for (var inv = 0; inv < 4; inv++) {
    res = (absAB[inv] < 0) ? (absAB[inv] * (-1)) : absAB[inv];
    relAB.push(roundTo(res, 4));
  }
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
  lastABOffset = [ parseInt((absAB[0] * -1)), parseInt(absAB[1]), thisAB  ]
  // return rect = [ absAB[0], absAB[1], absAB[2], absAB[3], w, h ];
  return rect = [ absAB[0], absAB[1], w, h ];

}



/** modified from Alexander Ladygin:
https://forums.adobe.com/thread/2109761  **/
function getBounds(arr, bounds) {
    var absX1, absY1, absX2, absY2;
    var x1 = [], y1 = [], x2 = [], y2 = [],
        bounds = bounds || 'geometricBounds';
    for (var i = 0; i < arr.length; i++) {
      x1.push(lastABOffset[0] + arr[i][bounds][0]);
      x2.push(lastABOffset[0] + arr[i][bounds][2]);
      y1.push((arr[i][bounds][1] + lastABOffset[1]) * -1);
      y2.push((arr[i][bounds][3] + lastABOffset[1]) * -1);
    }

    // relative
    x1 = Math.min.apply(null, x1);
    y1 = Math.min.apply(null, y1);
    x2 = Math.max.apply(null, x2);
    y2 = Math.max.apply(null, y2);
    w = x2 - x1;
    h = y2 - y1;

    // absolute
    if (lastABOffset[2] > 0) {
      absX1 = (lastABOffset[0] * -1) + x1;
      absX2 = (lastABOffset[0] * -1) + x2;
      absY1 = (lastABOffset[1] * -1) + y1;
      absY2 = (lastABOffset[1] * -1) + y2;
    } else {
      absX1 = x1;
      absY1 = y1;
      absX2 = x2;
      absY2 = y2;
    }
    return rect = [ x1, y1, x2, y2, w, h ] + ";" + [ absX1, absY1, absX2, absY2, w, h ];
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
