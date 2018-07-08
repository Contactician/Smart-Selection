// ArtboardCenterAroundSelectedPaths.jsx
// works with CS5
// http://forums.adobe.com/thread/1336506?tstart=0
// (title: script to align selected objects to artboard)
// quick & dirty, all selected items will be centered at the active artboard
// (include clipping paths  !visible result can be different)

// regards pixxxelschubser  19.Nov. 2013


/** @pixxxelschubser **/
function alignArtboardToSelection(){
  var aDoc = app.activeDocument;
  var Sel = aDoc.selection;

  if (Sel.length > 0) {
    var abIdx = aDoc.artboards.getActiveArtboardIndex();
    var actAbBds = aDoc.artboards[abIdx].artboardRect;
    var resRect = [];
    var vBounds = Sel[0].visibleBounds;
    vBounds_Li = vBounds[0];
    vBounds_Ob = vBounds[1];
    vBounds_Re = vBounds[2];
    vBounds_Un = vBounds[3];

    if (Sel.length > 1) {
      for (var i = 1; i < Sel.length; i++) {
        vBdsI = Sel[i].visibleBounds;
        if( vBounds_Li > vBdsI[0] ) {vBounds_Li = vBdsI[0]};
        if( vBounds_Ob < vBdsI[1] ) {vBounds_Ob = vBdsI[1]};
        if( vBounds_Re < vBdsI[2] ) {vBounds_Re = vBdsI[2]};
        if( vBounds_Un > vBdsI[3] ) {vBounds_Un = vBdsI[3]};
      }
      var newRect = [vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2), vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2)+(actAbBds[2]-actAbBds[0]), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2)+(actAbBds[3]-actAbBds[1])];
      resRect.push(newRect);

      // aDoc.artboards[abIdx].artboardRect = [vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2), vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2)+(actAbBds[2]-actAbBds[0]), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2)+(actAbBds[3]-actAbBds[1])];
    }
  } else {
    alert ("No selection");
  }
  return resRect;
}

// alignSelection();

/** @TenA
https://forums.adobe.com/thread/2111711  **/
function alignSelection(){
  var refBnds = app.activeDocument.selection[0].geometricBounds;
  for (var i = 0; i < app.selection.length; i++) {
    var target = app.selection[i];
    var ct = refBnds[0] + (refBnds[2] - refBnds[0]) / 2;
    var md = refBnds[1] + (refBnds[3] - refBnds[1]) / 2;
    var wd = target.width;
    var ht = target.height;
    target.position = [ct - wd / 2, md + ht / 2];
  }
}

// alert(getBBox());

// getBoundingBox();

// alert(getFullSizes())
// alert(getBounds(selection, 'geometricBounds'))

function getFullSizes(){
  var x, y, w, h;
  var bBox = [];
  for (var i = 0; i < app.selection.length; i++) {
    var trueRect = [];
    var rect = []
    var target = app.selection[i];
    var bounds = target.geometricBounds;
    for (var a = 0; a < bounds.length; a++) {
      if (bounds[a] < 0)
        bounds[a] = bounds[a]*(-1);
      rect.push(bounds[a])
    }
    x = rect[0];
    y = rect[1];
    w = rect[2];
    h = rect[3];
    // w = rect[0] - rect[2];
    // w = (w < 0) ? (w*(-1)) : (w)
    // h = rect[0] - rect[2];
    // h = (h < 0) ? (h*(-1)) : (h)
    // h = ((rect[1] - rect[3]) < 0) ? ((rect[1] - rect[3])*(-1)) : (rect[1] - rect[3])
    trueRect.push(x, y, w, h)
    bBox.push(trueRect);
  }
  return bBox;
}

function getTrueSizes(){
  var x, y, w, h;
  var group = [];
  for (var i = 0; i < app.selection.length; i++) {
    var trueRect = [];
    var rect = []
    var target = app.selection[i];
    var bounds = target.geometricBounds;
    for (var a = 0; a < bounds.length; a++) {
      if (bounds[a] < 0)
        bounds[a] = bounds[a]*(-1);
      rect.push(bounds[a])
    }
    x = rect[0];
    y = rect[1];
    w = rect[0] - rect[2];
    w = (w < 0) ? (w*(-1)) : (w)
    h = rect[0] - rect[2];
    h = (h < 0) ? (h*(-1)) : (h)
    // h = ((rect[1] - rect[3]) < 0) ? ((rect[1] - rect[3])*(-1)) : (rect[1] - rect[3])
    trueRect.push(x, y, w, h)
    group.push(trueRect);
  }
  return group;
}

// alert(getBoundingBox())

function getBoundingBox() {
  var fullBox = getFullSizes();
  var grp = getTrueSizes();
  var width, height;
  // iterate through objects to find numbers based on value and not selection order
  for (var u = 0; u < app.selection.length; u++) {
    var max_of_array = Math.max.apply(Math, grp[u]);
    alert(max_of_array);
  }

  width = (grp[0][0] - (grp[1][0] + grp[1][2]));
  height = (grp[0][1] - (grp[1][1] + grp[1][3]));
  width = (width < 0) ? width * (-1) : width;
  height = (height < 0) ? height * (-1) : height;
  return rect = [ grp[0][0], grp[0][1], width, height ];
  // alert("w: " + width + ", h:" + height)
}


// alert(getBounds(selection, 'geometricBounds'))




// var selectionXY = [ app.activeDocument.selection.bounds[0].as('px'),
//     app.activeDocument.selection.bounds[1].as('px') ];

// alert(selectionXY)
