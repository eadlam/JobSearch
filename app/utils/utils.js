export default {

  // Serializes a query object into a string
  serialize: function(query){
    return [query.page].concat(_.keys(query.companies)).join('-');
  }

}