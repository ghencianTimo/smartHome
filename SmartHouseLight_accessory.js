var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var Gpio = require('pigpio').Gpio,
  led = new Gpio(17, {mode: Gpio.OUTPUT});
var brightnessLED = 100;
var statusLED = 1;
var hueLED = 0;
var saturationLED = 0;
var RGB = [];
var redPin = 21;
var greenPin = 20;
var bluePin = 16;

  function float2int(value) {
      return value | 0;
  }



  function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    s /= 100;
    v /= 100;

    if(s == 0) {

        r = g = b = v;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            r = p;
            g = v;
            b = t;
            break;

        case 3:
            r = p;
            g = q;
            b = v;
            break;

        case 4:
            r = t;
            g = p;
            b = v;
            break;

        default:
            r = v;
            g = p;
            b = q;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}



var LightController = {
  name: "Smart House RGB",
  pincode: "012-34-567",
  username: "EM:3C:ED:5A:1A:1A",
  manufacturer: "Timo",
  model: "v1.0",
  serialNumber: "A12S345KGB",

  power: false,
  brightness: 100,
  hue: 0,
  saturation: 0,

  outputLogs: true,



  setPower: function(status) { //set power of accessory
    statusLED = status;
    RGB = hsvToRgb(hueLED, saturationLED, brightnessLED);
    if(this.outputLogs) console.log(this.name, "este:", status ? "aprins" : "stins");
    if(statusLED){
      Gpio(redPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[0]);
      Gpio(greenPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[1]);
      Gpio(bluePin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[2]);
  }    else{
    Gpio(redPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(greenPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(bluePin, {mode: Gpio.OUTPUT}).digitalWrite(0);

  }
    this.power = status;
  },

  getPower: function() { //get power of accessory
    if(this.outputLogs) console.log(this.name, "este:", this.power ? "aprins" : "stins");
    return this.power;
  },

  setBrightness: function(brightness) { //set brightness
    brightnessLED = brightness;
    RGB = hsvToRgb(hueLED, saturationLED, brightnessLED);
    if(this.outputLogs) console.log("Intensitatea este:", this.brightness, "%");
    if(statusLED){
      Gpio(redPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[0]);
      Gpio(greenPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[1]);
      Gpio(bluePin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[2]);
  }    else{
    Gpio(redPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(greenPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(bluePin, {mode: Gpio.OUTPUT}).digitalWrite(0);

  }
    this.brightness = brightness;
  },

  getBrightness: function() { //get brightness
    if(this.outputLogs) console.log("Intensitatea este:", this.brightness, "%");
    brightnessRGB = this.brightness;
    return this.brightness;
  },

  setSaturation: function(saturation) { //set brightness
    saturationLED = saturation;
    RGB = hsvToRgb(hueLED, saturationLED, brightnessLED);
    if(this.outputLogs) console.log("Saturatia este:", this.saturation);
    if(statusLED){
      Gpio(redPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[0]);
      Gpio(greenPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[1]);
      Gpio(bluePin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[2]);
  }    else{
    Gpio(redPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(greenPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(bluePin, {mode: Gpio.OUTPUT}).digitalWrite(0);

  }
    this.saturation = saturation;
  },

  getSaturation: function() { //get brightness
    if(this.outputLogs) console.log("Saturatia este:", this.saturation);
    return this.saturation;
  },

  setHue: function(hue) { //set brightness
    hueLED = hue;
    RGB = hsvToRgb(hueLED, saturationLED, brightnessLED);
    if(this.outputLogs) console.log("Hue este:", this.hue);
    if(statusLED){
      Gpio(redPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[0]);
      Gpio(greenPin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[1]);
      Gpio(bluePin, {mode: Gpio.OUTPUT}).pwmWrite(RGB[2]);
  }    else{
    Gpio(redPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(greenPin, {mode: Gpio.OUTPUT}).digitalWrite(0);
    Gpio(bluePin, {mode: Gpio.OUTPUT}).digitalWrite(0);

  }
    this.hue = hue;
  },

  getHue: function() { //get hue
    if(this.outputLogs) console.log("Hue este:", this.hue);
    return this.hue;
  },

  identify: function() { //identify the accessory
    if(this.outputLogs) console.log(this.name);
  }
}


var lightUUID = uuid.generate('hap-nodejs:accessories:light' + LightController.name);

var lightAccessory = exports.accessory = new Accessory(LightController.name, lightUUID);

lightAccessory.username = LightController.username;
lightAccessory.pincode = LightController.pincode;

lightAccessory
  .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, LightController.manufacturer)
    .setCharacteristic(Characteristic.Model, LightController.model)
    .setCharacteristic(Characteristic.SerialNumber, LightController.serialNumber);

// listen for the "identify" event for this Accessory
lightAccessory.on('identify', function(paired, callback) {
  LightController.identify();
  callback();
});


lightAccessory
  .addService(Service.Lightbulb, LightController.name)
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    LightController.setPower(value);


    callback();
  })

  .on('get', function(callback) {
    callback(null, LightController.getPower());
  });


lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Brightness)
  .on('set', function(value, callback) {
    LightController.setBrightness(value);
    callback();
  })
  .on('get', function(callback) {
    callback(null, LightController.getBrightness());
  });

lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Saturation)
  .on('set', function(value, callback) {
    LightController.setSaturation(value);
    callback();
  })
  .on('get', function(callback) {
    callback(null, LightController.getSaturation());
  });

lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Hue)
  .on('set', function(value, callback) {
    LightController.setHue(value);
    callback();
  })
  .on('get', function(callback) {
    callback(null, LightController.getHue());
  });
