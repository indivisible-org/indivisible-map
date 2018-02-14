firebasedb.ref('indivisible_groups').once('value').then((snapshot) => {
  snapshot.forEach((group) => {
    const zip = group.val().zip;
    const id = group.val().id;
    firebasedb.ref(`zips/${zip}`).once('value').then((latlog) => {
      if (latlog.exists()) {
        const updateObj = {};
        updateObj.longitude = latlog.val().LNG;
        updateObj.latitude = latlog.val().LAT;
        firebasedb.ref(`indivisible_groups/${id}`).update(updateObj);
      }
    });
  });
});
