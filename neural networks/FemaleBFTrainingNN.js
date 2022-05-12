// GETTING THE BRAIN.JS LIBRARY
const brain = require('brain.js')




//THE WOMENS TRAINING DATA:
const data = require('./womenBFStandardisedData.json');
const trainingData = data.map(item => ({
    input: [
      parseFloat(item.ageStandardised),
      parseFloat(item.HeightStandardised),
      parseFloat(item.WeightStandardised),
      parseFloat(item.neckStandardised),
      parseFloat(item.chestStandardised),
      parseFloat(item.hipsStandardised),
      parseFloat(item.thighStandardised),
      parseFloat(item.kneeStandardised),
      parseFloat(item.ankleStandardised),
      parseFloat(item.bicepsStandardised),
      parseFloat(item.forearmStandardised),
      parseFloat(item.wristStandardised),
    ],
    output: [parseFloat(item.bodyfatStandardised)],
  }));


// CONFIGURATION FOR THE NERUAL NETWORK AND TRAINING CONFIGURATION:
const netOptions = {
  hiddenLayers: [9],
  activation: 'sigmoid', 
  inputSize: 13,
  outputSize: 1,
};

const trainingOptions = {
  iterations: 150000,
  log: (details) => console.log(details),
  learningRate: 0.01,
};


// CREATING THE TRAINING BACKPROP NEURAL NETWORK WITH THE CROSS VALIDATION 
const crossValidate = new brain.CrossValidate(() => new brain.NeuralNetwork(netOptions));


// TRAINING THE NEURAL NETWORK ON THE DATASET AND USING K FOLDS CROSS VALIDATION TECHNIQUE
const stats = crossValidate.train(trainingData, trainingOptions, );

// CONSOLE LOGGING THE RESULTS OF TRAINING TO EXAMINE THE ERROR AND PERFORMANCE OF THE NN
console.log(stats);


// CONVERTING THE CROSS VALIDATION NETWORK TO A STANDARD NEURAL NETWORK:
const net = crossValidate.toNeuralNetwork();


// SAVING THE TRAINED NEURAL NETWORK INTO A JSON FILE FOR USE IN THE STRATEGYM APPLICATION: [NOTE - THIS SAVES IN THE STRATEGYM ROOT DIRECTORY BY DEFAULT]
  const fs = require("fs"); //fs NPM FILESYSTEM LIBRARY ALLOWS TO READ AND WRITE LOCAL DATA 
  const trainedNN = net.toJSON();


  fs.writeFileSync("femaleTrainedNN.json", JSON.stringify(trainedNN), 'utf-8');



