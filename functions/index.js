

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

//Количество cityCount обновляется в зависимости от списка городов в стране
exports.countCitiesDocumentsChange = functions.firestore.document('country/{countryId}/cities/{cityId}').onWrite((change, context) => {
                                                                                                                 
                                                                                                                 const countryId = context.params.countryId;
                                                                                                                 const countryRef = db.collection('country').doc(countryId)
                                                                                                                 
                                                                                                                 if (!change.before.exists) {
                                                                                                                 
                                                                                                                 // new document created : add one to count
                                                                                                                 countryRef.update({citiesCount: FieldValue.increment(1)});
                                                                                                                 console.log("%s numberOfDocs incremented by 1", countryId);
                                                                                                                 
                                                                                                                 } else if (change.before.exists && change.after.exists) {
                                                                                                                 
                                                                                                                 // updating existing document : Do nothing
                                                                                                                 
                                                                                                                 } else if (!change.after.exists) {
                                                                                                                 
                                                                                                                 // deleting document : subtract one from count
                                                                                                                 countryRef.update({citiesCount: FieldValue.increment(-1)});
                                                                                                                 console.log("%s numberOfDocs decremented by 1", countryId);
                                                                                                                 
                                                                                                                 }
                                                                                                                 
                                                                                                                 return 0;
                                                                                                                 });


//Количество places обновляется в зависимости от количества метс
exports.countPlacesDocumentsChange = functions.firestore.document('country/{countryId}/cities/{cityId}/places/{placeId}').onWrite((change, context) => {
                                                                                                                                  
                                                                                                                                  const placeId = context.params.placeId;
                                                                                                                                  
                                                                                                                                  const countryId = context.params.countryId
                                                                                                                                  const countryRef = db.collection('country').doc(countryId);
                                                                                                                                  console.log(`DEBUG Path of the subcollection country: ${countryRef.path}`);
                                                                                                                                  
                                                                                                                                  const cityId = context.params.cityId
                                                                                                                                  const cityRef = countryRef.collection('cities').doc(cityId)
                                                                                                                                  console.log(`DEBUG Path of the subcollection city : ${cityRef.path}`);
                                                                                                                                  
                                                                                                                                  const placeRef = cityRef.collection('places').doc(placeId)
                                                                                                                                  console.log(`DEBUG Path of the subcollection place: ${placeRef.path}`);
                                                                                                                                  
                                                                                                                                  if (!change.before.exists) {
                                                                                                                                  
                                                                                                                                  // new document created : add one to count
                                                                                                                                  //create id in id field in place's document
                                                                                                                                  placeRef.set({id: placeId})
                                                                                                                                  //count places +1 in country and city fields
                                                                                                                                  countryRef.update({placesCount: FieldValue.increment(1)});
                                                                                                                                  cityRef.update({placesCount: FieldValue.increment(1)});
                                                                                                                                  console.log("DEBUG places count decremented by 1");
                                                                                                                                  
                                                                                                                                  } else if (change.before.exists && change.after.exists) {
                                                                                                                                  
                                                                                                                                  // updating existing document : Do nothing
                                                                                                                                  
                                                                                                                                  } else if (!change.after.exists) {
                                                                                                                                  
                                                                                                                                  // deleting document : subtract one from count
                                                                                                                                  countryRef.update({placesCount: FieldValue.increment(-1)});
                                                                                                                                  cityRef.update({placesCount: FieldValue.increment(-1)});
                                                                                                                                  console.log("DEBUG places count decremented by 1");
                                                                                                                                  
                                                                                                                                  }
                                                                                                                                  
                                                                                                                                  return 0;
                                                                                                                                  });
