import axios from 'axios'
import Dispatcher from '../Dispatcher'
import Constants from '../Constants'
import Config from '../Config'

export default {

  query: function(id){

    var self = this;
    
    var url = Config.COMPANIES_URL + '/' + id + '?api_key=' + Config.API_KEY;
    // console.log("GET: ", url);
    
    // Get the request promise
    axios.get(url)

    // Resolve the successful request
    .then(function(response){
      self.cache(response.data);
    })

    // Catch any errors
    .catch(function(response){
      console.log("Query failed: ", response);
    });

  } ,

  cache: function(company){
    Dispatcher.next({
      type: Constants.COMPANY,
      data: company
    })
  }

}