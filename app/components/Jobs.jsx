import React from 'react';
import Job from './Job';

// Job iterator
var Jobs = React.createClass({

  render: function() {

    return (
      <div>
        { this.props.jobs.map(
            function(job){
              return (
                <Job key={job.id} data={job} />
              )
          })}
      </div>
    );

  }

});

export default Jobs;
