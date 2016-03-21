import React from 'react';
import Colors from 'material-ui/lib/styles/colors';


// This is the subtitle which includes the Company name, locations, and tags
var JobDetails = React.createClass({

  render: function() {

    var job = this.props.data;

    var levels = job.levels.map(function(level){
      return level.name;
    }).join(", ");

    var locations = job.locations.map(function(location){
      return location.name;
    }).join(" · ");

    var tags = job.tags.map(function(tag){
      return tag.name;
    }).join(" · ");

    return (
      <div>
        <div style={{marginBottom:'10px'}}>{levels}</div>
        <div>
          <b>{job.company.name}</b>
          <span style={
            {
              fontWeight:'normal', 
              fontSize:'.8em',
              color:Colors.grey700
            }
          }> - {locations}</span>
        </div>
      </div>
    );
  }

});

export default JobDetails;
