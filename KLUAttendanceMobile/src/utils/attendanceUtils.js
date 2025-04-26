// Calculate attendance percentage
export const calculatePercentage = (totalClasses, presents) => {
  if (totalClasses === 0) return 0;
  return (presents / totalClasses) * 100;
};

// Get attendance status (Eligible, Conditional, Not Eligible)
export const getAttendanceStatus = (percentage) => {
  if (percentage >= 85) return "Eligible";
  if (percentage >= 75) return "Conditional Eligibility";
  return "Not Eligible";
};

// Get attendance color based on status
export const getAttendanceColor = (percentage) => {
  if (percentage >= 85) return "#22c55e"; // green-500
  if (percentage >= 75) return "#eab308"; // yellow-500
  return "#ef4444"; // red-500
};

// Calculate LTPS weighted attendance
export const calculateLTPSAttendance = (components) => {
  let totalWeight = 0;
  let weightedSum = 0;

  // Weights for each component
  const weights = {
    lecture: 1,
    tutorial: 0.25,
    practical: 0.5,
    skilling: 0.25
  };

  // Calculate weighted sum
  Object.entries(components).forEach(([key, value]) => {
    const percentage = value.percentage;
    
    if (percentage !== null) {
      const weight = weights[key];
      totalWeight += weight;
      weightedSum += percentage * weight;
    }
  });

  // Return the weighted average
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

// Calculate how many classes can be missed while maintaining 75% attendance
export const classesCanMiss = (totalClasses, presents) => {
  const minRequiredFor75 = Math.ceil(totalClasses * 0.75);
  return Math.max(0, presents - minRequiredFor75);
};

// Calculate classes needed to reach target percentage
export const classesNeededToReach = (totalClasses, presents, targetPercentage) => {
  const targetClasses = Math.ceil(totalClasses * (targetPercentage / 100));
  return Math.max(0, targetClasses - presents);
}; 