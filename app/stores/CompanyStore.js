import Dispatcher from '../Dispatcher'
import Immutable from 'immutable'
import Constants from '../Constants'


var state = Immutable.Map();


var stream = Dispatcher.filter(function (x, idx, obs) {
  return x.type === Constants.COMPANY;
}).map(function(company){
  return company.data;
});


stream.subscribe(

    function (company) {
      state = state.set(company.id, company);
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
  }

};