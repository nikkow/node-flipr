# Node Flipr

[![npm](https://img.shields.io/npm/v/node-flipr.svg)](https://www.npmjs.com/package/node-flipr)
[![npm](https://img.shields.io/npm/dt/node-flipr.svg)](https://www.npmjs.com/package/node-flipr)
![license](https://img.shields.io/github/license/nikkow/node-flipr.svg)
![code size](https://img.shields.io/github/languages/code-size/nikkow/node-flipr)

![](docs/imgs/flipr-node.png)

## Intro

[Flipr](https://www.goflipr.com) devices are used to monitor private and public swimming pools. **Node-Flipr** is an unofficial NodeJS library used to communicate with them and retrieve their latest metrics. 

## Usage

### Setup

Run the following command in your project to install the latest version of Node-Flipr.

```
npm install node-flipr --save
```

Then, all you need is to import this library to start using it:

#### Javascript

```javascript
var nodeFlipr = require('node-flipr');
var flipr = new nodeFlipr.Flipr(config);
```

#### TypeScript
```typescript
import { Flipr } from 'node-flipr';
```

### Basic usage

```javascript
var Flipr = require('node-flipr').Flipr;
var TemperatureUnit = require('node-flipr').TemperatureUnit;
var DisinfectantType = require('node-flipr').DisinfectantType;

var flipr = new Flipr({
  username : "your flipr email address" ,
  password : "your flipr password",
  deviceSerial: "your flipr serial"
})

flipr.getLastMeasure().then(metrics => {
  console.log('--- General information ---');
  console.log('Date: ', metrics.getDate());
  console.log('Battery level (percent): ', metrics.getBatteryLevel());
  console.log('Battery level (raw): ', metrics.getBatteryLevel(true));
  console.log('UV Index: ', metrics.getUVIndex());
  console.log('Cloud coverage (percent): ', metrics.getCloudCoverage());
  console.log('Cloud coverage (raw): ', metrics.getCloudCoverage(true));
  console.log('');
  console.log('--- Water temperature ---');
  console.log('Temperature in Celcius: ', metrics.getTemperature(TemperatureUnit.CELCIUS));
  console.log('Temperature in Fahrenheit: ', metrics.getTemperature(TemperatureUnit.FAHRENHEIT));
  console.log('Temperature in Kelvin: ', metrics.getTemperature(TemperatureUnit.KELVIN));
  console.log('');
  console.log('--- Disinfectant ---');
  console.log('Disinfectant is Chlorine? ', metrics.getDisinfectantType() === DisinfectantType.CHLORINE ? "yes" : "no");
  console.log('Disinfectant is Bromine? ', metrics.getDisinfectantType() === DisinfectantType.BROMINE ? "yes" : "no");
  console.log('Disinfectant is Salt? ', metrics.getDisinfectantType() === DisinfectantType.SALT ? "yes" : "no");
  console.log('Disinfectant deviation: ', metrics.getDisinfectantDeviation(true));
  console.log('Disinfectant deviation variation: ', metrics.getDisinfectantDeviation());
  console.log('');
  console.log('--- PH ---');
  console.log('PH value: ', metrics.getPHValue());
  console.log('PH deviation: ', metrics.getPHDeviation(true));
  console.log('PH deviation variation: ', metrics.getPHDeviation());
})

```

### API Reference

In progress.