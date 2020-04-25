// At the top of test/index.test.js

const admin = require('firebase-admin');

const projectConfig = {
    projectId: 'cruzhacks-application',
    databaseURL: 'https://cruzhacks-application.firebaseio.com'
  };

const test = require('firebase-functions-test')(projectConfig, '../permissions.json');



const myFunctions = require('../index.js');
const sinon = require('sinon');
const chai  = require('chai');
const assert = chai.assert;

  // A fake request object, with req.query.text set to 'input'


// Require index.js and save the exports inside a namespace called myFunctions.
// This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
// and myFunctions.addMessage



// A fake request object, with req.query.text set to 'input'
it('createHacker: should return 200', function(done) {
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '20',
                    "gender": "Non-binary",
                    "UCSC": true,
                    "affiliation": "Crown"
                },
                "logistics": {
                    "help": false,
                    "accomodations": null
                },
                "experiences": {
                    "first-hackathon": false,
                    "essay": "Hi, I'm excited about cruz hacks!"
                }
            }
        }
    
    };
    var statusCode = 0;
    var res = {
        send: function(){ },
        json: function(err){
        },
        status: function(responseStatus) {
            try {
                assert.equal(responseStatus, 200);
                done();
            } catch (error) {
                done(error);
            }
           
            // This next line makes it chainable
            return this; 
        }
    }
    myFunctions.createHacker(req, res);
   
});

it('getHacker: should return 200', function(done) {

    const req = {
        query: {},
        body:
            {
                "first-name": "Priya",
                "last-name": "Rajarathinam",
                "email": "prajarat@ucsc.edu"
            },
        

    };
    var statusCode = 0;
    var res = {
        send: function(info){
        },
        json: function(err){
        },
        status: function(responseStatus) {
            try {
                assert.equal(responseStatus, 200);
                done();
            } catch (error) {
                done(error);
            }
           
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.getHacker(req, res);


});
it('updateHacker: should return 200', function(done) {
    const req = {
        query:{},
        body:
            {
                "hacker": {
                    "demographics": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '21',
                        "gender": "Female",
                        "UCSC": true,
                        "affiliation": "9/10"
                    },
                    "logistics": {
                        "help": false,
                        "accomodations": "I need food!"
                    },
                    "experiences": {
                        "first-hackathon": false,
                        "essay": "Hi!"
                    },
                    "submitted": false
                },
                "demographics": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '21',
                        "gender": "Female",
                        "UCSC": true,
                        "affiliation": "9/10"
                 },
            }
        };
        var statusCode = 0;
        var res = {
            send: function(info){
                try{
                    assert.equal(info, 'Update hacker successful');
                    assert.equal(statusCode, 200);
                    done();
                } catch (error){
                    done(error);
                }
              
            },
            json: function(err){
            },
            status: function(responseStatus) {
                statusCode = responseStatus;
                // This next line makes it chainable
                return this; 
            }
        };
        myFunctions.updateHacker(req,res);
});

it('getHacker: should return 200 and accomadation I need food!', function (done){
    const req = {
        query: {},
        body:
            {
                "first-name": "Priya",
                "last-name": "Rajarathinam",
                "email": "prajarat@ucsc.edu"
            },
        

    };
    var statusCode = 0;
    var res = {
        send: function(info){
           try {
            assert.equal(info['logistics']['accomodations'], "I need food!");
            assert.equal(this.statusCode, 200);
            done();
           } catch (error){
               done();
           }
            
            
           
        },
        json: function(err){
        },
        status: function(responseStatus) {
            
            statusCode = responseStatus;
            
            
          
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.getHacker(req, res);
});

it('updateHackerDemographics: should return 200', function(done){
    const req = {
        query:{},
        body:
            {
                "hacker": {
                    "demographics": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '21',
                        "gender": "Female",
                        "UCSC": true,
                        "affiliation": "9/10"
                    },
                    "demographics-new": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '21',
                        "gender": "Male",
                        "UCSC": true,
                        "affiliation": "9/10"
                    },
                    "submitted": false
                }
            }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'Update demographics successful');
                assert.equal(statusCode, 200);
                done();
            } catch (done) {

            }
         
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerDemographics(req,res);
    
});
it('updateHackerDemographics: should return 403', function(done){
    const req = {
        query:{},
        body:
            {
                "hacker": {
                    "demographics": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '21',
                        "gender": "Female",
                        "UCSC": true,
                        "affiliation": "9/10"
                    },
                    "demographics-new": {
                        "first-name": "Priya",
                        "last-name": "Rajarathinam",
                        "email": "prajarat@ucsc.edu",
                        "age": '2122',
                        "gender": "Male",
                        "UCSC": true,
                        "affiliation": "9/10"
                    },
                    "submitted": false
                }
            }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'invalid fields');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                done(error);
            }

        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerDemographics(req,res);
    
});

it('updateHackerExperiences: should return 200', function(done){
    const req = {
        query:{},
        body: {
            "hacker": {
                   "demographics": {
                       "first-name": "Priya",
                       "last-name": "Rajarathinam",
                       "email": "prajarat@ucsc.edu",
                       "age": '21',
                       "gender": "Female",
                       "UCSC": true,
                       "affiliation": "9/10"
                   },
                   "experiences": {
                       "first-hackathon": false,
                       "essay": "Hi, I've upated my experieneces!"
                   },
                   "submitted": false
               }
           }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'Update experiences successful');
                assert.equal(statusCode, 200);
                done();
            } catch (error){
                done(error);
            }
         
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerExperiences(req,res);
    
});

it('updateHackerExperiences: should return 403 invalid fields', function(done){
    const req = {
        query:{},
        body: {
            "hacker": {
                   "demographics": {
                       "first-name": "Priya",
                       "last-name": "Rajarathinam",
                       "email": "prajarat@ucsc.edu",
                       "age": '21',
                       "gender": "Female",
                       "UCSC": true,
                       "affiliation": "9/10"
                   },
                   "experiences": {
                       "first-hackathon": false,
                       "essay": `
                       djfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffdcdkcncjdcknjkscnksnjkcnksnckjdnkcscscs
                        `
                   },
                   "submitted": false
               }
           }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'invalid fields');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                done(error);
            }
          
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerExperiences(req,res);
    
});

it('updateHackerLogistics: should return 200', function(done){
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '21',
                    "gender": "Female",
                    "UCSC": true,
                    "affiliation": "9/10"
                },
                "logistics": {
                    "help": false,
                    "accomodations": "I've updated logistics!"
                },
            }
        }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try { 
                assert.equal(info, 'Update logistics successful');
                assert.equal(statusCode, 200);
                done();
 
            } catch (error) {
                done(error);
            }
         
        },
        json: function(err){
        },
        status: function(responseStatus) {

            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerLogistics(req,res);
    
});
it('updateHackerLogistics: should return 403 invalid fields', function(done){
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '21',
                    "gender": "Female",
                    "UCSC": true,
                    "affiliation": "9/10"
                },
                "logistics": {
                    "help": false,
                    "accomodations": "djfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffddjfjskfjkjljljkljkljljkdjljkfjklsjkjdjfjsldjklsjflkdjlfjsljfdfsfsffsfsfsfsfsffd"
                },
            }
        }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'invalid fields');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                    done(error);            
            }
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerLogistics(req,res);
    
});

it('getHacker: should get updated fields and return 200', function (done){
    const req = {
        query: {},
        body:
            {
                "first-name": "Priya",
                "last-name": "Rajarathinam",
                "email": "prajarat@ucsc.edu"
            },
        

    };
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info['demographics']['gender'], "Male");
                assert.equal(info['experiences']['essay'], "Hi, I've upated my experieneces!");
                assert.equal(info['logistics']['accomodations'], "I've updated logistics!");
                assert.equal(statusCode, 200);
                done();
            } catch (error) {
                done(error);
            }
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.getHacker(req, res);
});

it('updateHackerSubmitted: should return 200', function(done){
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '21',
                    "gender": "Female",
                    "UCSC": true,
                    "affiliation": "9/10"
                }
            }
        }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'Update submission status successful');
                assert.equal(statusCode, 200);
                done();
            } catch (error) {
                done(error);            
            }
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerSubmitted(req,res);
    
});

it('updateHackerLogistics: should return 403 cannot update after submission', function(done){
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": 21,
                    "gender": "Female",
                    "UCSC": true,
                    "affiliation": "9/10"
                },
                "logistics": {
                    "help": false,
                    "accomodations": "I've updated logistics!"
                },
            }
        }
    }
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'Cannot update after submission');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                    done(error);            
            }
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.updateHackerLogistics(req,res);
    
});

it('createHacker: should return 403 invalid fields', function(done) {
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya^^",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '2000',
                    "gender": "Non-binary",
                    "UCSC": true,
                    "affiliation": "Crown"
                },
                "logistics": {
                    "help": false,
                    "accomodations": null
                },
                "experiences": {
                    "first-hackathon": false,
                    "essay": "Hi, I'm excited about cruz hacks!"
                }
            }
        }
    
    };
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'invalid fields');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                done(error);            
            }
            assert.equal(info, 'invalid fields');
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = 403;
            // This next line makes it chainable
            return this; 
        }
    }
    myFunctions.createHacker(req, res);
   
});

it('createHacker: should return 403 user already exists', function(done) {
    const req = {
        query:{},
        body:{
            "hacker": {
                "demographics": {
                    "first-name": "Priya",
                    "last-name": "Rajarathinam",
                    "email": "prajarat@ucsc.edu",
                    "age": '21',
                    "gender": "Non-binary",
                    "UCSC": true,
                    "affiliation": "Crown"
                },
                "logistics": {
                    "help": false,
                    "accomodations": null
                },
                "experiences": {
                    "first-hackathon": false,
                    "essay": "Hi, I'm excited about cruz hacks!"
                }
            }
        }
    
    };
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, 'User already exists');
                assert.equal(statusCode, 403);
                done();
            } catch (error) {
                done(error);            
            }
           
            
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus
            // This next line makes it chainable
            return this; 
        }
    }
    myFunctions.createHacker(req, res);
   
});

it('deleteHacker: should return 200 with correct body', function(done) {
    const req = {
        query: {},
        body:
        {
            "first-name": "Priya",
            "last-name": "Rajarathinam",
            "email": "prajarat@ucsc.edu"
        }
    };
    var statusCode = 0;
    var res = {
        send: function(info){
            try {
                assert.equal(info, "Delete hacker successful");
                assert.equal(statusCode, 200);
                done();
            } catch (error) {
                done(error);
            }
           
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
           
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.deleteHacker(req,res);
   

});


it('deleteHacker: should return 404', function(done) {
    const req = {
        query: {},
        body:
        {
            "first-name": "Priya",
            "last-name": "Rajarathinam",
            "email": "prajarat@ucsc.edu"
        }
    };
    var statusCode = 0;
    var res = {
        send: function(info){
          try {
            assert.equal(info, 'Cannot find hacker');
            assert.equal(statusCode, 404);
            done();
          } catch (error) {
            done(error);
          }
         
        },
        json: function(err){
        },
        status: function(responseStatus) {
            statusCode = responseStatus;
            // This next line makes it chainable
            return this; 
        }
    };
    myFunctions.deleteHacker(req,res);

});


test.cleanup();
// Invoke addMessage with our fake request and response objects. This will cause the
// assertions in the response object to be evaluated.



// Invoke addMessage with our fake request and response objects. This will cause the
// assertions in the response object to be evaluated.