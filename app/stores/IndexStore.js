import _ from 'lodash'
import Rx from 'rxjs'
import Dispatcher from '../Dispatcher'
import Immutable from 'immutable'
import Constants from '../Constants'


var companies = Immutable.Map();


// Convert companies to array and sort alphabetically
var getState = function(){
  return {
    companies: _.sortBy(companies.toArray(), function(c){
      return c.name.toUpperCase();
    })
  }
};


// The entire state gets published to the stream on change
var stream = new Rx.Subject();


// Listen for new jobs 
var jobs = Dispatcher.filter(function (x, idx, obs) {
  return x.type === Constants.JOB;
}).map(function(response){
  return response.data;
});


// Index features of the job (right now we only index company names)
// TODO: add more interesting indexes, like # of jobs for each company
jobs.subscribe(

    function (jobs) {
      _.forEach(jobs.results, function(job){
        if(!companies.has(job.company.id)){
          // This company object is mutable
          companies = companies.set(job.company.id, {
            id: job.company.id,
            name: job.company.name
          });
        }
        stream.next(getState());
      })
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
  all: getState
};