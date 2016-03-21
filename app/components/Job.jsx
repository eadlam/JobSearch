import React from 'react'

import Colors from 'material-ui/lib/styles/colors'

import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardHeader from 'material-ui/lib/card/card-header'
import CardMedia from 'material-ui/lib/card/card-media'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'

import RaisedButton from 'material-ui/lib/raised-button'

import JobDetails from './JobDetails'
import CompanyActions from '../actions/CompanyActions'
import CompanyStore from '../stores/CompanyStore'

import Divider from 'material-ui/lib/divider';



var Job = React.createClass({


  getInitialState: function(){
    return {
      expanded: false,
      company: null
    }
  },


  componentWillMount: function(){
    var job = this.props.data;

    // TODO: not sure if this component should be tied to the CompanyStore...
    var company = CompanyStore.get(job.company.id);

    // Fetch the company data from the cache or query on cache miss
    // TODO: not sure if this component should be tied to CompanyActions...
    if(company){
      // console.log("Company: CACHE_HIT", job.company.id);
      this.setState({
        company: company
      });
    } else {
      // console.log("Company: CACHE_MISS", job.company.id);
      CompanyActions.query(job.company.id);
    }

    // Watch for the company data to arrive, and update state
    CompanyStore.stream.filter(function(company){
      return company.id === job.company.id;
    }).subscribe(function(company){
      this.setState({
        company: company
      });
    }.bind(this));
  },



  render: function() {

    var job = this.props.data;
    var company = this.state.company;

    // join location array into a string
    var locations = job.locations.map(function(location){
      return location.name;
    }).join(" · ");


    // TODO: there are too many checks for whether company exists or not. Should
    //       maybe check this somewhere else
    // TODO: move inline styles somewhere else
    return (

      <Card onExpandChange={this.toggleExpanded}
            zDepth={this.state.expanded ? 2 : 1}
            /* Change card color when expanded or contracted */
            style={{
              backgroundColor: this.state.expanded ? 
                               Colors.white : 
                               Colors.grey100,
              marginBottom: '10px'
            }}>

        <CardHeader
          style={{height: '95px'}}
          title={<b>{job.name}</b>}
          subtitle={<JobDetails data={job} />}
          avatar={company ? company.refs.logo_image : undefined}
          actAsExpander={true}
          showExpandableButton={true}
        />

        <Divider expandable={true} />

        {/* Main body of the job listing */}
        <div expandable={true}
             style={{height:'500px', overflowY: 'auto'}}>
          <CardMedia  style={{height:'300px', overflowY:'hidden'}}
                      overlay={
                  <CardTitle title={company ? company.name : ""} 
                             subtitle={company ? company.description : ""} /> }>
            <img src={company ? company.refs.f1_image : undefined} />
          </CardMedia>

          <CardText dangerouslySetInnerHTML={{__html: job.contents}}>
          </CardText>
        </div>

        <Divider />

        {/* Footer with button to go to job page */}
        <CardActions expandable={true}>
          <RaisedButton 
                      label="Apply Now" 
                      secondary={true}
                      onClick={
                        this.openJobPage.bind(this, job.refs.landing_page)
                      }/>
        </CardActions>

      </Card>
    );
  },


  toggleExpanded: function(){
    this.setState({
      expanded: !this.state.expanded
    })
  },


  openJobPage: function(url){
    window.open(url);
  }


});

export default Job;
