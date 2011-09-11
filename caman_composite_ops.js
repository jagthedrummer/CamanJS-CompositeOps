/*global Caman: true, exports: true */
if (!Caman && typeof exports == "object") {
  var Caman = {manip:{}};
  exports.plugins = Caman.manip;
}

(function (Caman) {

  Caman.extend( Caman.manip.blenders, {
    
    
  hardLight: function (rgbaLayer, rgbaParent) {
    var result = {};
    
    result.r = 
      (rgbaParent.r > 128) ? 
        255 - ((255 - rgbaParent.r) * (255 - (rgbaLayer.r - 128))) / 255 : 
        (rgbaParent.r * (rgbaLayer.r + 128)) / 255;
      
    result.g = 
      (rgbaParent.g > 128) ? 
        255 - ((255 - rgbaParent.g) * (255 - (rgbaLayer.g - 128))) / 255 : 
        (rgbaParent.g * (rgbaLayer.g + 128)) / 255;
    
    result.b = (rgbaParent.b > 128) ? 
      255 - ((255 - rgbaParent.b) * (255 - (rgbaLayer.b - 128))) / 255 : 
      (rgbaParent.b * (rgbaLayer.b + 128)) / 255;
      
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