export const fetchEmergencies = () => (
  fetch('/api/emergencies')
    .then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
);