import _ from 'lodash'
import axios from 'axios'
import Dispatcher from '../Dispatcher'
import Constants from '../Constants'
import Config from '../Config'

export default {

  query: function(query, queryID){

    var self = this;

    var url = Config.JOBS_URL + '?api_key=' + Config.API_KEY;
        url = url + "&page=" + query.page;

    // Add each company in the query to the url, e.g.: ?company=a&company=b
    // The axios api for passing parameters through an object incorrectly
    // encodes the key when the value is a list. For example:
    // {company:['a', 'b']} gets encoded as: ?company[]=a&company[]=b
    _.forEach(_.values(query.companies), function(company){
      url = url + '&company=' + company;
    })

    // console.log("GET: ", url);

    // Make the request, returns a promise
    axios.get(url)

    // Resolve the successful request by passing the data to the cache action
    .then(function(response){
      self.cache({
        queryID: queryID,
        results: response.data.results
      });
    })

    // Catch any errors
    .catch(function(response){
      console.log("Query failed: ", response);
    });

  } ,

  // Send the data to the dispatcher
  cache: function(data){
    Dispatcher.next({
      type: Constants.JOB,
      data: data
    })
  }

}