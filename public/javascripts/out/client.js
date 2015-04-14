var Training = function Training() {
  "use strict";
  console.log("Training object constructed");
};
($traceurRuntime.createClass)(Training, {total: function() {
    "use strict";
    return {
      distance: 0,
      duration: 0,
      pace: "0:00"
    };
  }}, {});
