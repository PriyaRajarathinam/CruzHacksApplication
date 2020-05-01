var serviceAccount = require("./permissions.json");

const admin = require('firebase-admin');
const firebase = require('firebase/app');
const functions = require('firebase-functions');
require('firebase/auth');
require('firebase/firestore');
var firebaseConfig = {
  apiKey: apiKey,
  authDomain: "cruzhacks-application.firebaseapp.com",
  databaseURL: "https://cruzhacks-application.firebaseio.com",
  projectId: "cruzhacks-application",
  storageBucket: "cruzhacks-application.appspot.com",
  messagingSenderId: "942888289964",
  appId: "1:942888289964:web:fe979f9fe1a6a754e2c109",
  measurementId: "G-ZXYBVNM2XM"
};
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cruzhacks-application.firebaseio.com",
  databaseAuthVariableOverride: null
});
const fs = require('fs');
const db = admin.firestore();
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
*/
function hackerObj(hacker){
  var hackerData = { 
    demographics: hacker.demographics,
    experiences: hacker.experiences,
    logistics: hacker.logistics,
    submitted: false
  };
  return hackerData;
}


function validateHackerDemographics(demographics){
  var alphaNumeric = /^[a-zA-Z0-9 \.\'?!,-]*$/;

  if(demographics['first-name'] == undefined || demographics['last-name'] == undefined 
    || demographics['gender'] == undefined || demographics['UCSC'] == undefined){
      return false;
    }

  if(demographics['UCSC'] == true){
    if(demographics['affiliation'] == undefined){
      return false
    }
  }
  if (!demographics['first-name'].match(alphaNumeric) 
      || !demographics['last-name'].match(alphaNumeric) 
      || !demographics['gender'].match(alphaNumeric)){
        return false;

  }
  if(demographics['first-name'].length + demographics['last-name'].length > 100){
    return false;
  }

  var numeric = '^[0-9]*$';
  if(!demographics['age'].match(numeric)){
    return false;
  }
  if(demographics['age'].length < 1 || demographics['age'].length > 3){
    return false;
  }
  if(demographics['year'] != undefined){
    if(!demographics['year'].match(numeric)){
      return false;
    }
    if(demographics['year'].length != 4){
      return false
    }
  }
  return true;
}

function validateHackerExperiences(experiences){
  var alphaNumeric = /^[a-zA-Z0-9 \.\'?!,-]*$/;
  if(experiences['first-hackathon'] == undefined || experiences['essay'] == undefined){
    return false;
  }
  if(!experiences['essay'].match(alphaNumeric)){
    return false;
  }
  if(experiences['essay'].length > 500){
    return false;
  }
  return true;
 
}

function validateHackerLogistics(logistics){
  var alphaNumeric = /^[a-zA-Z0-9 \.\'?!,-]*$/;
  if (logistics['help'] == undefined ){
    return false;
  }
  if (logistics['accomodations'] != undefined){
    if(!logistics['accomodations'].match(alphaNumeric)){
      return false;
    }
    if(logistics['accomodations'].length > 150){
      return false;
    }
  }
  return true;
}

exports.createHacker = functions.https.onRequest( 

  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then( db => {
      (async () => {
      
        try {
            if(!validateHackerDemographics(req.body['hacker']['demographics']) ||
               !validateHackerExperiences(req.body['hacker']['experiences']) ||
               !validateHackerLogistics(req.body['hacker']['logistics'])){
                 return res.status(403).send('invalid fields');
            }
            var hackerRef = db.collection('hackers');
            let dict = req.body['hacker']['demographics'];
            var check = false;
            await hackerRef.get().then(querySnapshot => {
              if(querySnapshot.size > 0){
                check = true;
              }
            });
            if (check){
              let query = hackerRef.where('demographics.last-name', '==',dict['last-name']).
              where('demographics.first-name', '==', dict['first-name']).
              where('demographics.email', '==', dict['email']);
              await query.get().then(querySnapshot => {
                if (querySnapshot.size > 0){
                  return res.status(403).send('User already exists');
                }
              });
            } else {
              await db.collection('hackers').add(hackerObj(req.body.hacker));
              return res.status(200).send('Created hacker');
            }
           
          
        } catch (error){
          return res.status(500).send(error);
        }
      })();
    });
   
  }
);

exports.getHacker = functions.https.onRequest(
  (req, res) => {

  const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
    // Sign in the Client SDK as 'my-worker'
    return firebase.auth().signInWithCustomToken(token).then(user => {
      user.uuid = req.headers.token;
      return firebase.firestore();
    });
  });
  return firebaseAuth.then(db => {
    (async () => {
      try {
        let dict = req.body;
        let response = []
        var hackerRef = db.collection('hackers');
        let query = hackerRef.where('demographics.last-name', '==',dict['last-name']).
        where('demographics.first-name', '==', dict['first-name']).
        where('demographics.email', '==', dict['email']);
        await query;
        await query.get().then(querySnapshot => {
          querySnapshot.forEach(function(doc) {
            response.push(doc.data());
          });
          console.log("boutta send response");
          return res.status(200).send(response[0]);
        });
       
      } catch (error){
        return res.status(500).send(error);
      }
    })();
  })
  
}
);

exports.updateHackerDemographics = functions.https.onRequest(
  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then(db => {

  
    (async () => {
      try {
        let dict = req.body;
        let demographics = dict["hacker"]["demographics"]
        var hackerRef = db.collection('hackers');
        if(!validateHackerDemographics(dict['hacker']['demographics-new'])){
          return res.status(403).send('invalid fields');
        } else {
          hackerRef.where('demographics.last-name', '==',demographics['last-name']).
          where('demographics.first-name', '==', demographics['first-name']).
          where('demographics.email', '==', demographics['email'])
          .get().then(querySnapshot => {
            if (querySnapshot.empty){
              return res.status(404).send('Cannot find hacker');
            }
            querySnapshot.forEach(function(doc) {
              let id = doc.id;
              if(doc.data()['submitted'] == true){
                return res.status(403).send('Cannot update after submission');
              }
              db.collection('hackers').doc(id).update({ "demographics":dict['hacker']["demographics-new"]}).then(function(){
                return res.status(200).send('Update demographics successful');
              });
            });
           
          });
        }
      
      } catch (error){
        return res.status(500).send(error);
      }
  
    })();
  });
  }
);

exports.updateHackerExperiences = functions.https.onRequest(
  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then(db => {
    (async () => {
      try {
        let dict = req.body;
        let demographics = dict["hacker"]["demographics"]
        var hackerRef = db.collection('hackers');
        if(!validateHackerExperiences(dict['hacker']['experiences'])){
          return res.status(403).send('invalid fields');
        } else {
          hackerRef.where('demographics.last-name', '==',demographics['last-name']).
          where('demographics.first-name', '==', demographics['first-name']).
          where('demographics.email', '==', demographics['email'])
          .get().then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
              if (querySnapshot.empty){
                return res.status(404).send('Cannot find hacker');
              }
              let id = doc.id;
              if(doc.data()['submitted'] == true){
                return res.status(403).send('Cannot update after submission');
              }
              db.collection('hackers').doc(id).update({ "experiences": dict['hacker']['experiences']}).then(function(){
                return res.status(200).send('Update experiences successful');
              });
            });
           
          });
        }
      
      } catch (error){
        return res.status(500).send(error);
      }
  
    })();
  });
  }
);

exports.updateHackerLogistics = functions.https.onRequest(
  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then(db => {

    
    (async () => {
      try {
        let dict = req.body;
        let demographics = dict['hacker']["demographics"]
        if(!validateHackerLogistics(dict['hacker']['logistics'])){
          return res.status(403).send('invalid fields');
        } else {
          var hackerRef = db.collection('hackers');
          hackerRef.where('demographics.last-name', '==',demographics['last-name']).
          where('demographics.first-name', '==', demographics['first-name']).
          where('demographics.email', '==', demographics['email'])
          .get().then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
              if (querySnapshot.empty){
                return res.status(404).send('Cannot find hacker');
              }
              let id = doc.id;
              if(doc.data()['submitted'] == true){
                return res.status(403).send('Cannot update after submission');
              }
              db.collection('hackers').doc(id).update({ "logistics": dict['hacker']['logistics']}).then(function(){
                return res.status(200).send('Update logistics successful');
              });
            });
          
          });
        }
        
      } catch (error){
        return res.status(500).send(error);
      }
  
    })();
  });
  }
);

exports.updateHackerSubmitted = functions.https.onRequest(
  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then(db => {
    (async () => {
      try {
        let dict = req.body;
        let demographics = dict["hacker"]["demographics"]
        var hackerRef = db.collection('hackers');
        hackerRef.where('demographics.last-name', '==',demographics['last-name']).
        where('demographics.first-name', '==', demographics['first-name']).
        where('demographics.email', '==', demographics['email'])
        .get().then(querySnapshot => {
          if (querySnapshot.empty){
            return res.status(404).send('Cannot find hacker');
          }
          querySnapshot.forEach(function(doc) {
            let id = doc.id;
            if(doc.data()['submitted'] == true){
              return res.status(403).send('Cannot update after submission');
            }
            db.collection('hackers').doc(id).update({ "submitted": true}).then(function(){
              return res.status(200).send('Update submission status successful');
            });
          });
         
        });
      } catch (error){
        return res.status(500).send(error);
      }
  
    })();
  })
  }
);

exports.updateHacker = functions.https.onRequest(
  (req, res) => {

    const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
      // Sign in the Client SDK as 'my-worker'
      return firebase.auth().signInWithCustomToken(token).then(user => {
        user.uuid = req.headers.token;
        return firebase.firestore();
      });
    });
    return firebaseAuth.then(db => {
    (async() => {
      try {
        let dict = req.body;
        let demographics = dict["demographics"]
        if(!validateHackerDemographics(req.body.hacker.demographics) ||
             !validateHackerExperiences(req.body.hacker.experiences) ||
             !validateHackerLogistics(req.body.hacker.logistics)){
               return res.status(403).send('invalid fields');
        }

        var hackerRef = db.collection('hackers');
        let query = hackerRef.where('demographics.last-name', '==',demographics['last-name']).
        where('demographics.first-name', '==', demographics['first-name']).
        where('demographics.email', '==', demographics['email']);

        await query.get().then(querySnapshot => {
          if (querySnapshot.size == 0){
            return res.status(404).send('Cannot find hacker');
          }
          querySnapshot.forEach(function(doc) {
            let id = doc.id;
            if(doc.data()['submitted'] == true){
              return res.status(403).send('Cannot update after submission');
            }
            db.collection('hackers').doc(id).update(hackerObj(dict['hacker'])).then(function(){
              return res.status(200).send('Update hacker successful');
            });
          });
         
        });
       
      } catch (error){
        return res.status(500).send(error);
      }
    })();
  });
  }
);

// Update Full Hacker Profile given demographics, experiences, and logistics
exports.deleteHacker = functions.https.onRequest(
  (req, res) => {

  const firebaseAuth = admin.auth().createCustomToken(req.headers.token).then(token => {
    // Sign in the Client SDK as 'my-worker'
    return firebase.auth().signInWithCustomToken(token).then(user => {
      user.uuid = req.headers.token;
      return firebase.firestore();
    });
  });
  return firebaseAuth.then(db => {
  (async () => {
    
    try {
      let dict = req.body;
      let response = []
      var hackerRef = db.collection('hackers');
      let query = hackerRef.where('demographics.last-name', '==',dict['last-name']).
      where('demographics.first-name', '==', dict['first-name']).
      where('demographics.email', '==', dict['email']);
      await query;
      let doc_id = 0;
      await query.get().then(querySnapshot => {
        if (querySnapshot.empty){
          return res.status(404).send('Cannot find hacker');
        }
        querySnapshot.forEach( async(doc) => {
           doc_id = doc.id;
          hackerRef.doc(doc_id).delete().then(() => {
           return res.status(200).send('Delete hacker successful');
          });
           
         
        });
         
       
      
      });
    } catch (error){
      return res.status(500).send(error);
    } 
  })();
});
}
);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
