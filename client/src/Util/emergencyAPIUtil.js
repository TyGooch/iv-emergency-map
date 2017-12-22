// export const fetchEmergencies = data => (
//   fetch('/api/emergencies/latest')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`status ${response.status}`);
//       }
//       return response.json();
//     })
//     // .then(emergencies => {
//     //   if( this.state.emergencies[0]._id !== emergencies[0]._id ){
//     //     // var newEmergencies = emergencies.filter(emergency => this.state.emergencies.indexOf(emergency) < 0);
//     //     // this.createMarkers(newEmergencies);
//     //     this.setState({ emergencies: emergencies });
//     //   }
//     // }).catch(e => {
//     //   this.setState({
//     //     emergencies: `API call failed: ${e}`,
//     //   });
//     // })
// );

export const fetchEmergencies = () => (
  fetch('/api/emergencies')
    .then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
);
