import _ from 'lodash'
import React from 'react'

import utils from '../utils/utils'
import Constants from '../Constants'

import JobStore from '../stores/JobStore'
import JobActions from '../actions/JobActions'

import IndexStore from '../stores/IndexStore'

import Jobs from './Jobs'

import Checkbox from 'material-ui/lib/checkbox'

import RaisedButton from 'material-ui/lib/raised-button'
import HardwareArrowLeft from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-left';
import HardwareArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';

import LeftNav from 'material-ui/lib/left-nav'


export default React.createClass({



  getInitialState: function(){
    return {
      jobs:[],
      query:{
        page: 0,
        companies: {}
      },
      index: IndexStore.all()
    }
  },



  componentDidMount: function() {

    // Always update company index as it grows
    IndexStore.stream.subscribe(function(index){
      this.setState({index: index});
    }.bind(this));

    // Start by loading page 0 with no filters
    this.debounceQuery();

  },



  render: function() {

    var jobs = this.state.jobs;

    // TODO: move styles to main.css
    var styles = {
      checkbox: {
        marginBottom: 5,
      },
      container: {
        paddingLeft: 300
      },
      page:{
        fontSize: 24
      },
      leftNav: {
        paddingLeft:16, 
        paddingTop:16, 
        width:275
      },
      leftNavHeader: {
        fontWeight:'bold', 
        marginBottom:5
      }
    };

    return (

      <div className="container" style={styles.container}>

        <LeftNav style={styles.leftNav} open={this.state.open}>
          <div style={styles.leftNavHeader}>Companies</div>
          {/* Add a checkbox and label for each company thats been indexed */}
          {this.state.index.companies.map(function(company){
            var id = company.id;
            var name = company.name;
            return (
              <Checkbox onCheck={this.handleCheck.bind(this, id, name)}
                        checked={_.has(this.state.query.companies, id)}
                        key={id}
                        style={styles.checkbox}
                        label={ <span>{name}</span>}/>
            )
          }.bind(this))}
        </LeftNav>

        {/* TODO: move pagination controls to their own component */}
        {/* Pagination controls */}
        <div style={{paddingBottom:10}}>
          <RaisedButton secondary={true} 
                        onClick={this.decrement} 
                        label=" " 
                        icon={<HardwareArrowLeft/>} />
          <RaisedButton secondary={true} 
                        disabled={true} 
                        label={this.state.query.page + 1} />
          <RaisedButton secondary={true} 
                        onClick={this.increment} 
                        label=" " 
                        labelPosition="before" 
                        icon={<HardwareArrowRight/>} /> 
        </div>  

        <Jobs jobs={jobs}/>   
      
        {/* Pagination controls */}
        <div style={{paddingBottom:10}}>
          <RaisedButton secondary={true} 
                        onClick={this.decrement} 
                        label=" " 
                        icon={<HardwareArrowLeft/>} />
          <RaisedButton secondary={true} 
                        disabled={true} 
                        label={this.state.query.page + 1} />
          <RaisedButton secondary={true} 
                        onClick={this.increment} 
                        label=" " 
                        labelPosition="before" 
                        icon={<HardwareArrowRight/>} /> 
        </div> 

      </div>

    );
  },



  // Set page number and send query
  setPage: function(page){
    var query = this.state.query;
    this.setState({
      query: _.assign(query, {
        page: page
      })
    });
    this.debounceQuery();
  },



  // Decrements the page - stops at 0
  decrement: function(){
    if(this.state.query.page > 0){
      this.setPage(this.state.query.page - 1);
    }
  },



  // TODO: disable increment page button when page limit has been reached
  // Increments the page - never stops
  increment: function(){
    this.setPage(this.state.query.page + 1);
  },



  // Try to fetch data from the JobsStore
  // If there is a cache miss, send query to JobsActions
  // debounce calls to this function to prevent UI from blocking when the user
  // checks multiple companies in quick succession
  // TODO: find better solution, the debouncing makes it feel laggy
  debounceQuery: _.debounce(function(){

    // clear the jobs so we can see that something is happening and so we can
    // see the difference in response time when there is a cache hit vs a cache
    // miss
    this.setState({
      jobs:[]
    });

    // Try to get cached jobs
    var queryID = utils.serialize(this.state.query);
    var jobs = JobStore.getCached(queryID);
    // console.log("Jobs: ", jobs.status, queryID);

    // If there is a cache miss, send new query
    if(jobs.status === Constants.CACHE_MISS){
      
      // watch for the response to be cached
      JobStore.stream.filter(function(entry){
        return entry === queryID;
      })

      // catch the new cache entry and lookup jobs again
      .subscribe(function(queryID){
        var jobs = JobStore.getCached(queryID);
        this.setState({
          jobs: JobStore.getCached(queryID).results
        })
      }.bind(this));

      // initiate api query
      this.query(queryID);

    // Cache hit: update UI state
    } else {
      this.setState({
        jobs: JobStore.getCached(queryID).results
      })
    }

  // debounce wait time in milliseconds
  }, 500),



  // Checking a box adds the company id to the query and unchecking removes it.
  // The material-ui checkboxes are currently broken - the box doesn't check if
  // you setState onCheck, so we have to manually keep track of the checked 
  // state. We do this by seeing if the company id is in the query or not
  handleCheck: function(id, name){

    // make a copy of companies so we don't directly mutate the state object
    var companies = _.clone(this.state.query.companies);
    
    // toggle the company by adding/removing it from the query
    if(id in companies){
      delete companies[id];
    } else {
      companies[id] = name;
    }
    
    this.setState({
      query: _.assign(this.state.query, {
        companies: companies,
        page: 0
      })
    }) 
    // update jobs list
    this.debounceQuery();
  },



  query: function(id){
    JobActions.query(this.state.query, id);
  }

});
