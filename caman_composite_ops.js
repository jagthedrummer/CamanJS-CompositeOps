/*
 * 
 * Some more blending operators and a different version 
 * of some existing ones.  This is to have blender that adhere
 * to the Adobe blending spec as used by many other programs.
 * http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/PDF32000_2008.pdf
 */

/*global Caman: true, exports: true */
if (!Caman && typeof exports == "object") {
  var Caman = {manip:{}};
  exports.plugins = Caman.manip;
}

(function (Caman) {

  Caman.extend( Caman.manip.blenders, {
  //rgbaParent = background = cb
  //rgbaLayer = source = cs
  
  adobeOverlay : function(rgbaLayer, rgbaParent){
    return Caman.manip.blenders['hardLight'](rgbaParent, rgbaLayer);  
  }, 
  
  singleMultiply: function(cb,cs){
    return (cb * cs) / 255; // have to divide by 255 since we're not in the 0-1 space
  },
  
  singleScreen: function(cb,cs){
    return cb + cs - (cb * cs / 255); // have to divide by 255 since we're not in the 0-1 space
  },
  
  singleDarken: function(cb,cs){
    if(cb < cs){
      return cb;
    }
    return cs;
  },
  
  singleLighten: function(cb,cs){
    if(cb > cs){
      return cb;
    }
    return cs;
  },
  
  darken : function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.manip.blenders['singleDarken'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleDarken'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleDarken'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  lighten : function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.manip.blenders['singleLighten'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleLighten'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleLighten'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  
  singleColordodge: function(cb,cs){
    var cr = 255; 
    if(cs < 255){
      cr = Math.min(255, cb/(255-cs)*255 ); //need to account for dividing by 255
    }
    return cr;
  },
  
  colordodge : function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.manip.blenders['singleColordodge'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleColordodge'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleColordodge'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  
  
  
  singleColorburn: function(cb,cs){
    var cr = 0; 
    if(cs > 0){
      cr = 255 - Math.min(255, (255-cb)/cs*255 ); //need to account for dividing by 255
    }
    return cr;
  },
  
  colorburn : function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.manip.blenders['singleColorburn'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleColorburn'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleColorburn'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  
  // cb = color of background pixel
  // cs = color of source pixel
  singleHardLight: function(cb,cs){
    var cr = 0;
    if(cs < 127.5){
      cr = Caman.manip.blenders['singleMultiply'](cb,2*cs);
    }else{
      cr = Caman.manip.blenders['singleScreen'](cb,2*cs - 255);
    }
    return cr;
  },
  
  hardLight: function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.manip.blenders['singleHardLight'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleHardLight'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleHardLight'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  // taks a number between 0 - 1 and converts to 0-255
  toByteSize : function(x){
    return x * 255;
  },
  
  // takes a number between 0 - 255 and converts to 0 - 1
  toOneSize : function(x){
    return x/255;
  },
  
  singleD: function(x){
    
    var r = 0;
    if(x <= 0.25){
      r = ((16 * x - 12) * x + 4) * x
    }else{
      r = Math.sqrt(x);
    }
    return r;
  },
  
  // cb = color of background pixel
  // cs = color of source pixel
  singleSoftLight: function(cb,cs){
    cb = Caman.manip.blenders['toOneSize'](cb);
    cs = Caman.manip.blenders['toOneSize'](cs);
    var cr = 0;
    if(cs < 127.5){
      cr = cb - (1 - 2 * cs) * cb * (1 - cb) 
    }else{
      cr = cb + (2 * cs - 1) * (Caman.manip.blenders['singleD'](cb) - cb)
    }
    return cb = Caman.manip.blenders['toByteSize'](cr);
  },
  
  adobeSoftLight: function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.manip.blenders['singleSoftLight'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleSoftLight'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleSoftLight'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  
  // cb = color of background pixel
  // cs = color of source pixel
  singleAdobeDifference: function(cb,cs){
    return Math.abs(cb - cs);
  },
  
  adobeDifference: function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.manip.blenders['singleAdobeDifference'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleAdobeDifference'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleAdobeDifference'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  },
  
  // cb = color of background pixel
  // cs = color of source pixel
  singleAdobeExclusion: function(cb,cs){
    cb = Caman.manip.blenders['toOneSize'](cb);
    cs = Caman.manip.blenders['toOneSize'](cs);
    var cr = cb + cs - 2 * cb * cs; 
    return Caman.manip.blenders['toByteSize'](cr);
  },
  
  adobeExclusion: function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.manip.blenders['singleAdobeExclusion'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.manip.blenders['singleAdobeExclusion'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.manip.blenders['singleAdobeExclusion'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  }
  
  
  /*
   * These are here for easy reference 
   *
   multiply: function (rgbaLayer, rgbaParent) {
    return {
      r: (rgbaLayer.r * rgbaParent.r) / 255,
      g: (rgbaLayer.g * rgbaParent.g) / 255,
      b: (rgbaLayer.b * rgbaParent.b) / 255,
      a: 255
    };
  },
  
  screen: function (rgbaLayer, rgbaParent) {
    return {
      r: 255 - (((255 - rgbaLayer.r) * (255 - rgbaParent.r)) / 255),
      g: 255 - (((255 - rgbaLayer.g) * (255 - rgbaParent.g)) / 255),
      b: 255 - (((255 - rgbaLayer.b) * (255 - rgbaParent.b)) / 255),
      a: 255
    };
  }
   */
    
  });

}(Caman));