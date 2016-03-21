import Rx from 'rxjs';
import Dispatcher from '../Dispatcher';
import Immutable from 'immutable';
import Constants from '../Constants';

// keys are the job id
// values are the job object
var state = Immutable.Map();

// keys represent job filter queries
// values are a list of job ids that match that query
var cacheIndex = Immutable.Map();

// new cached query keys are published to this stream
var stream = new Rx.Subject();

// listen for incoming jobs
var jobs = Dispatcher.filter(function (data, idx, obs) {
  return data.type === Constants.JOB;
}).map(function(jobs){
  return jobs.data;
});

// add new jobs to state
jobs.subscribe(

    function (data) {

      // Store each job in the state cache 
      _.forEach(data.results, function(job){
        state = state.set(job.id, job);
      });

      // Cache the list of job id's using the queryID as the key
      cacheIndex = cacheIndex.set(data.queryID, data.results.map(function(job){
        return job.id;
      }));

      // publish the new query key
      stream.next(data.queryID);
    },

    function (err) {
      console.log('Error: %s', err);
    },

    function () {
      console.log('Completed');
    }
);


export default {
  
  stream: stream,

  get: function(id){
    return state.get(id);
  },

  all: function(){
    return state;
  },

  getCached: function(id){
    if(cacheIndex.has(id)){
      return {
        id: id,
        status: Constants.CACHE_HIT,
        results: cacheIndex.get(id).map(function(jobID){
          return state.get(jobID);
        })
      }
    } else {
      return {
        id: id,
        status: Constants.CACHE_MISS
      }
    }
  }

};