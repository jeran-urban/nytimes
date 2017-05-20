// Include React
var React = require("react");

var Footer = React.createClass({
    render: function() {
        return (<footer><hr/><p className="pull-right"><i className="fa fa-github" aria-hidden="true"></i>Proudly built using React.js</p></footer>
        );
    }
});

// Export the component back for use in other files
module.exports = Footer;
