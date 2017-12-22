export const asArray = ({ emergencies }) => (
  Object.keys(emergencies).map(key => emergencies[key])
);
