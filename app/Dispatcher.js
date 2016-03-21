import Rx from 'rxjs';

var Dispatcher = new Rx.Subject();

// Dispatcher.subscribe(
//   function(val){
//     console.log("Event:", val);
//   },
//   function(err){
//     console.log("Error", test);
//   });

export default Dispatcher
