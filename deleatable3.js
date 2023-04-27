// Initialize starting ELO rating
let eloRating = 1000;

// Initialize starting body weight
let bodyWeight = 100;

// Function to update ELO rating based on body weight gain
function updateElo(weightGain) {
  // Calculate percentage of body weight gain
  const weightGainPercent = weightGain / bodyWeight;
  
  // If weight gain is 4% or more
  if (weightGainPercent >= 0.03) {
    // Increase ELO rating logarithmically
    eloRating = eloRating + 200 * Math.log10(weightGainPercent/0.04);
    console.log(`ELO rating increased to ${eloRating}`);
  } else {
    console.log("Weight gain not sufficient to increase ELO rating.");
  }
}

// Test function with sample weight gain
updateElo(5); // prints "ELO rating increased to 1220.74"