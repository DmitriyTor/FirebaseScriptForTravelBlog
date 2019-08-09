

    'use strict';

    const functions = require('firebase-functions');
    const admin = require('firebase-admin');
    admin.initializeApp();
    const db = admin.firestore();
    const FieldValue = require('firebase-admin').firestore.FieldValue;

//Количество placesCount обновляется в зависимости от списка городов в стране
    exports.countDocumentsChange = functions.firestore.document('country/{countryId}/cities/{cityId}').onWrite((change, context) => {

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
