//FREQUENCY OF TRAINING THE MUSCLE GROUP PER WEEK DOESNT MATTER AS LONG AS IT REACHES THE SAME VOLUME
//E.G. COULD DO 10 SETS 5 REPS 1X A WEEK OR 5 SETS 5 REPS 2X A WEEK

// DO 3-6 REPS PER EXERCISE
// DO 3-6 SETS PER EXERCISE
// DO 10+ SETS PER MUSCLE GROUP PER WEEK
// MORE REPS = LESS SETS AND VICE VERSA

const strengthx1 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Seated Rear Lateral Raise',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
];

//STRENGTH 2X A WEEK -- UPPER BODY/LOWER BODY SPLIT

// UPPER BODY - 10 SETS PER MUSCLE GROUP -- 5 SETS 5 REPS PER EXERCISE --
const strengthx2D1 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Seated Rear Lateral Raise',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },

  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
];

// LOWER BODY - 10 SETS PER MUSCLE GROUP -- 5 SETS 5 REPS PER EXERCISE
const strengthx2D2 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
];

//STRENGTH 3X A WEEK -- PUSH/PULL/LEGS SPLIT

// PUSH --> 10 SETS PER MUSCLE GROUP, 5 SETS PER EXERCISE,  5 REPS PER EXERCISE
const strengthx3D1 = [
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
];

// PULL --> 10 SETS PER MUSCLE GROUP, 5 SETS PER EXERCISE,  5 REPS PER EXERCISE
const strengthx3D2 = [
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
];

// LEGS--> 10 SETS PER MUSCLE GROUP, 5 SETS PER EXERCISE,  5 REPS PER EXERCISE
const strengthx3D3 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 5,
    Reps: 5,
  },
];

//STRENGTH 4X A WEEK -- UPPER BODY/LOWER BODY 2X A WEEK

// UPPER BODY 1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx4D1 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Seated Rear Lateral Raise',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },

  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// LOWER BODY 1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx4D2 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// UPPER BODY 2 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx4D3 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Seated Rear Lateral Raise',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },

  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// LOWER BODY 2 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx4D4 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

//STRENGTH 5X A WEEK -- PUSH/PULL/LEGS/UPPER BODY/LOWER BODY SPLIT

// UPPER BODY 1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx5D1 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Seated Rear Lateral Raise',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },

  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// LOWER BODY 1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx5D2 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// PUSH --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx5D3 = [
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
];

// PULL --> 6 SETS PER MUSCLE GROUP, 2 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx5D4 = [
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
];

// LEGS --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx5D5 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// STRENGTH 6X A WEEK -- PUSH/PULL/LEGS 2X A WEEK

// PUSH1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D1 = [
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
];

// PULL1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D2 = [
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
];

// LEGS1 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D3 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

// PUSH2 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D4 = [
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 6,
  },
];

// PULL2 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D5 = [
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 3,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 5,
  },
];

// LEGS2 --> 6 SETS PER MUSCLE GROUP, 3 SETS PER EXERCISE,  6 REPS PER EXERCISE
const strengthx6D6 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 3,
    Reps: 6,
  },
];

//STRENGTH 7 A WEEK -- SHOULDERS/CHEST/BACK/BICEPS/TRICEPS/ABS/LEGS

//SHOULDERS -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D1 = [
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Shoulder Press',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: '45-Degree Incline Row',
    MuscleGroup: 'Shoulders',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
];

//CHEST -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D2 = [
  {
    Exercise: 'Barbell Bench Press',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Pec Deck Machine',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Cable Crossovers',
    MuscleGroup: 'Chest',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
];

//BACK -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D3 = [
  {
    Exercise: 'I-Y-T Raises',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Pull-ups',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Bent-over Rows',
    MuscleGroup: 'Back',
    Type: 'Weighted',
    Equipment: 'Barbell',
    Sets: 4,
    Reps: 5,
  },
];

//BICEPS -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D4 = [
  {
    Exercise: 'Concentration Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Cable Curls',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Chin-ups',
    MuscleGroup: 'Biceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
];

//TRICEPS -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D5 = [
  {
    Exercise: 'Triangle Push-ups',
    MuscleGroup: 'Triceps',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Tricep Kickbacks',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Dips',
    MuscleGroup: 'Triceps',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
];

//ABS -- 12 SETS IN TOTAL, 3 EXERCISES, 4 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D6 = [
  {
    Exercise: 'Crunch (Arms Extended)',
    MuscleGroup: 'Abs',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Hanging Leg Raises',
    MuscleGroup: 'Abs',
    Type: 'Bodyweight',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Side Bends',
    MuscleGroup: 'Abs',
    Type: 'Weighted',
    Equipment: 'Dumbbell',
    Sets: 4,
    Reps: 5,
  },
];

//LEGS -- 12 SETS IN TOTAL, 4 EXERCISES, 3 SETS PER EXERCISE, 5 REPS PER EXERCISE
const strengthx7D7 = [
  {
    Exercise: 'Hack Sqaut',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Donkey Calf Raises',
    MuscleGroup: 'Legs',
    Type: 'Weighted',
    Equipment: 'Machine',
    Sets: 4,
    Reps: 5,
  },
  {
    Exercise: 'Quadruped Hip Extension',
    MuscleGroup: 'Legs',
    Type: 'Bodyweight',
    Equipment: 'Floor Mat',
    Sets: 4,
    Reps: 5,
  },
];

module.exports = {
  strengthx1,
  strengthx2D1,
  strengthx2D2,
  strengthx3D1,
  strengthx3D2,
  strengthx3D3,
  strengthx4D1,
  strengthx4D2,
  strengthx4D3,
  strengthx4D4,
  strengthx5D1,
  strengthx5D2,
  strengthx5D3,
  strengthx5D4,
  strengthx5D5,
  strengthx6D1,
  strengthx6D2,
  strengthx6D3,
  strengthx6D4,
  strengthx6D5,
  strengthx6D6,
  strengthx7D1,
  strengthx7D2,
  strengthx7D3,
  strengthx7D4,
  strengthx7D5,
  strengthx7D6,
  strengthx7D7,
};
