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

  

  //Caman.extend( Caman.manip.blenders, {
  //rgbaParent = background = cb
  //rgbaLayer = source = cs
  

  Caman.Blender.register('adobeOverlay',function(rgbaLayer, rgbaParent){
    return Caman.Blender.blenders['hardLight'](rgbaParent, rgbaLayer);
  });
  
  Caman.Blender.register('singleMultiply', function(cb,cs){
    return (cb * cs) / 255; // have to divide by 255 since we're not in the 0-1 space
  });
  
  Caman.Blender.register('singleScreen', function(cb,cs){
    return cb + cs - (cb * cs / 255); // have to divide by 255 since we're not in the 0-1 space
  });
  
  Caman.Blender.register('singleDarken', function(cb,cs){
    if(cb < cs){
      return cb;
    }
    return cs;
  });
  
  Caman.Blender.register('singleLighten', function(cb,cs){
    if(cb > cs){
      return cb;
    }
    return cs;
  });
  
  Caman.Blender.register('darken', function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.Blender.blenders['singleDarken'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleDarken'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleDarken'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  Caman.Blender.register('lighten', function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.Blender.blenders['singleLighten'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleLighten'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleLighten'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  
  Caman.Blender.register('singleColordodge', function(cb,cs){
    var cr = 255; 
    if(cs < 255){
      cr = Math.min(255, cb/(255-cs)*255 ); //need to account for dividing by 255
    }
    return cr;
  });
  
  Caman.Blender.register('colordodge', function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.Blender.blenders['singleColordodge'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleColordodge'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleColordodge'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  
  
  
  Caman.Blender.register('singleColorburn', function(cb,cs){
    var cr = 0; 
    if(cs > 0){
      cr = 255 - Math.min(255, (255-cb)/cs*255 ); //need to account for dividing by 255
    }
    return cr;
  });
  
  Caman.Blender.register('colorburn', function(rgbaLayer, rgbaParent){
    var result = {};
    result.r = Caman.Blender.blenders['singleColorburn'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleColorburn'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleColorburn'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  
  // cb = color of background pixel
  // cs = color of source pixel
  Caman.Blender.register('singleHardLight', function(cb,cs){
    var cr = 0;
    if(cs < 127.5){
      cr = Caman.Blender.blenders['singleMultiply'](cb,2*cs);
    }else{
      cr = Caman.Blender.blenders['singleScreen'](cb,2*cs - 255);
    }
    return cr;
  });
  
  Caman.Blender.register('hardLight', function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.Blender.blenders['singleHardLight'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleHardLight'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleHardLight'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  // taks a number between 0 - 1 and converts to 0-255
  Caman.Blender.register('toByteSize', function(x){
    return x * 255;
  });
  
  // takes a number between 0 - 255 and converts to 0 - 1
  Caman.Blender.register('toOneSize', function(x){
    return x/255;
  });
  
  Caman.Blender.register('singleD', function(x){
    
    var r = 0;
    if(x <= 0.25){
      r = ((16 * x - 12) * x + 4) * x
    }else{
      r = Math.sqrt(x);
    }
    return r;
  });
  
  // cb = color of background pixel
  // cs = color of source pixel
  Caman.Blender.register('singleSoftLight', function(cb,cs){
    cb = Caman.Blender.blenders['toOneSize'](cb);
    cs = Caman.Blender.blenders['toOneSize'](cs);
    var cr = 0;
    if(cs < 127.5){
      cr = cb - (1 - 2 * cs) * cb * (1 - cb) 
    }else{
      cr = cb + (2 * cs - 1) * (Caman.Blender.blenders['singleD'](cb) - cb)
    }
    return cb = Caman.Blender.blenders['toByteSize'](cr);
  });
  
  Caman.Blender.register('adobeSoftLight', function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.Blender.blenders['singleSoftLight'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleSoftLight'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleSoftLight'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  
  // cb = color of background pixel
  // cs = color of source pixel
  Caman.Blender.register('singleAdobeDifference', function(cb,cs){
    return Math.abs(cb - cs);
  });
  
  Caman.Blender.register('adobeDifference', function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.Blender.blenders['singleAdobeDifference'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleAdobeDifference'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleAdobeDifference'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  // cb = color of background pixel
  // cs = color of source pixel
  Caman.Blender.register('singleAdobeExclusion', function(cb,cs){
    cb = Caman.Blender.blenders['toOneSize'](cb);
    cs = Caman.Blender.blenders['toOneSize'](cs);
    var cr = cb + cs - 2 * cb * cs; 
    return Caman.Blender.blenders['toByteSize'](cr);
  });
  
  Caman.Blender.register('adobeExclusion', function (rgbaLayer, rgbaParent) {
    var result = {};    
    result.r = Caman.Blender.blenders['singleAdobeExclusion'](rgbaParent.r,rgbaLayer.r);
    result.g = Caman.Blender.blenders['singleAdobeExclusion'](rgbaParent.g,rgbaLayer.g);
    result.b = Caman.Blender.blenders['singleAdobeExclusion'](rgbaParent.b,rgbaLayer.b);
    result.a = 255;
    return result;
  });
  
  
  /*
   * These are here for easy reference 
   *
   Caman.Blender.register('multiply', function (rgbaLayer, rgbaParent) {
    return {
      r: (rgbaLayer.r * rgbaParent.r) / 255,
      g: (rgbaLayer.g * rgbaParent.g) / 255,
      b: (rgbaLayer.b * rgbaParent.b) / 255,
      a: 255
    };
  });
  
  Caman.Blender.register('screen', function (rgbaLayer, rgbaParent) {
    return {
      r: 255 - (((255 - rgbaLayer.r) * (255 - rgbaParent.r)) / 255),
      g: 255 - (((255 - rgbaLayer.g) * (255 - rgbaParent.g)) / 255),
      b: 255 - (((255 - rgbaLayer.b) * (255 - rgbaParent.b)) / 255),
      a: 255
    };
  });
   */
    
  //});

}(Caman));
