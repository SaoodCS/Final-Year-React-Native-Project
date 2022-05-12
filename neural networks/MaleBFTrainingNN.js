// GETTING THE BRAIN.JS LIBRARY
  const brain = require('brain.js')




//THE MENS TRAINING DATA:
const data = require('./mensBFStandardisedData.json');
const trainingData = data.map(item => ({
  input: [
    parseFloat(item.AgeStandardised),
    parseFloat(item.HeightStandardised),
    parseFloat(item.WeightStandardised),
    parseFloat(item.NeckCircumStandardised),
    parseFloat(item.ChestCircumStandardised),
    parseFloat(item.AbdomenCircumStandardised),
    parseFloat(item.HipCircumStandardised),
    parseFloat(item.ThighCircumStandardised),
    parseFloat(item.KneeCircumStandardised),
    parseFloat(item.AnkleCircumStandardised),
    parseFloat(item.BicepCircumStandardised),
    parseFloat(item.ForearmCircumStandardised),
    parseFloat(item.WirstCirumStandardised),
  ],
  output: [parseFloat(item.BodyFatStandardised)],
}));


// CONFIGURATION FOR THE NERUAL NETWORK AND TRAINING CONFIGURATION:
const netOptions = {
  hiddenLayers: [9],
  activation: 'sigmoid', 
  inputSize: 13,
  outputSize: 1,
};

const trainingOptions = {
  iterations: 200000,
  log: (details) => console.log(details),
  learningRate: 0.005,
  errorThresh: 0.001
};


// CREATING THE TRAINING BACKPROP NEURAL NETWORK WITH THE CROSS VALIDATION 
const crossValidate = new brain.CrossValidate(() => new brain.NeuralNetwork(netOptions));


// TRAINING THE NEURAL NETWORK ON THE DATASET AND USING K FOLDS CROSS VALIDATION TECHNIQUE
const stats = crossValidate.train(trainingData, trainingOptions, );

// CONSOLE LOGGING THE RESULTS OF TRAINING TO EXAMINE THE ERROR AND PERFORMANCE OF THE NN
console.log(stats);


// CONVERTING THE CROSS VALIDATION NETWORK TO A STANDARD NEURAL NETWORK:
const net = crossValidate.toNeuralNetwork();


// SAVING THE TRAINED NEURAL NETWORK INTO A JSON FILE FOR USE IN THE STRATEGYM APPLICATION [NOTE - THIS SAVES IN THE STRATEGYM ROOT DIRECTORY BY DEFAULT]
  const fs = require("fs"); //fs NPM FILESYSTEM LIBRARY ALLOWS TO READ AND WRITE LOCAL DATA 
  const trainedNN = net.toJSON();


  fs.writeFileSync("maleTrainedNN.json", JSON.stringify(trainedNN), 'utf-8');



