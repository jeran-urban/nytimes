// Include React
var React = require("react");
var axios = require("axios");

var Body = React.createClass({
    getInitialState: function() {
        return {
            search: "",
            start: "",
            end: "",
            resultsArray: [],
            content: []
        }
    },

    handleChange: function(event) {
       console.log("TEXT CHANGED");
       var newState = {};
       newState[event.target.id] = event.target.value;
       this.setState(newState);
    },
  
    logArticle: function(event) {
      event.preventDefault();
      var article = [];
      // var article = event.currentTarget.closest('.list-group-item').outerHTML;
      console.log(article); 
      console.log(event.currentTarget);
      console.log(event.currentTarget.title);
      console.log(event.currentTarget.id);
      console.log(event.currentTarget.value);
      article.push(event.currentTarget.title, event.currentTarget.id, event.currentTarget.value);
      // console.log();
      // console.log(article.json);
      return axios.post("/api", { article: article });
    },

    getComponent: function(event){
        var _this = this;
        var e = event;
        
        event.preventDefault();
        var resultsArray = [];
        console.log(event);
        console.log(this.state);
        var userInput = this.state.search;
        var startYear = this.state.start;
        var stopYear = this.state.end;

        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        var queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=7700f817c7cd4e78be4d5c94dadbf8c0&q=" + userInput + "&begin_date=" + startYear + "0101&end_date=" + stopYear + "1231";

        axios({
            method:'get',
            url:queryUrl,
            responseType:'stream'
        }).then(function(result) {
            console.log(result);
            // If the request is successful
                if (result.status === 200) {            
                    for(var i = 0; i < result.data.response.docs.length; i++) {
                        // console.log("title " + result.data.response.docs[i].headline.main);
                        // console.log("byline " + result.data.response.docs[i].byline.original);
                        // console.log("section " + result.data.response.docs[i].section_name);
                        // console.log("date " + result.data.response.docs[i].pub_date);
                        // console.log("url " + result.data.response.docs[i].web_url);

                        resultsArray.push(result.data.response.docs[i]);

                    }
                }
            console.log("results: ", resultsArray.length);
            console.log("TEXT CHANGED");
            console.log(_this.state.resultsArray);
            _this.setState({resultsArray: resultsArray});
        });
    },

    content: function () {
        var _this = this;
        if (this.state.content.length === 0) {
            return  <div className="container">
            <div className="jumbotron"><h2 className="text-center"><strong>(ReactJS) New York Times Article Scrubber</strong></h2><h3 className="text-center">Search for and save articles of interest.</h3>
                </div>
                <div className="main-container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h1 className="panel-title"><strong><i className="fa fa-newspaper-o" aria-hidden="true"></i>Query</strong></h1>
                                </div>
                                <div className="panel-body">
                                    <form>
                                        <div className="form-group">
                                            <h4 className=""><strong>Topic</strong></h4>
                                            <input type="text" value={_this.state.search} className="form-control" id="search" required="" onChange={_this.handleChange}></input>
                                                <h4><strong>Start Year</strong></h4>
                                            <input type="number" value={_this.state.start} className="form-control" id="start" required="" onChange={_this.handleChange}></input>
                                                <h4><strong>End Year</strong></h4>
                                            <input type="number" value={_this.state.end} className="form-control" id="end" required="" onChange={_this.handleChange}></input>
                                        </div>
                                        <div className="pull-right">
                                            <button onClick={_this.getComponent} type="submit" className="btn btn-danger">
                                                <h4>Submit</h4>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul>
                  {this.renderResults()}
                </ul>
                </div>
          }
          else {
            var _this = this;
            console.log(this.state.content);
            
            return this.state.content.map(result =>
            // <ul key={result._id}><li>{result.article}</li></ul>
            <li key={result._id} className='list-group-item'>
                <h3>
                <p className="headline">
                    {result.article[0]}
                </p>
                    <p className='btn-group pull-right'>
                        <a className="url" href={result.article[1]} rel='noopener noreferrer' target='_blank'>
                            <button className='btn btn-default'>View Article</button>
                        </a>
                        <button id={result._id} key='prime' onClick={_this.deleteSaved} className='btn btn-primary'>Delete</button>
                    </p>
                </h3>
                <p className="date">Date Published: {result.article[2]}</p>
            </li>
            );
        }
    },
      
    renderResults: function() {
          var _this = this;
          var please = "";
          if (this.state.resultsArray.length) {
            return this.state.resultsArray.map(result =>
            <li key={result.pub_date} className='list-group-item'>
                <h3>
                <p className="headline">
                    {result.headline.main}
                </p>
                    <p className='btn-group pull-right'>
                        <a className="url" href={result.web_url} rel='noopener noreferrer' target='_blank'>
                            <button className='btn btn-default'>View Article</button>
                        </a>
                        <button title={result.headline.main} value={result.pub_date} id={result.web_url} key='prime' onClick={_this.logArticle} className='btn btn-primary'>Save</button>
                    </p>
                </h3>
                <p className="date">Date Published: {result.pub_date}</p>
            </li>
            );
          }
          else {
            return <li>Enter search terms to begin...</li>;
        }
    },

    deleteSaved: function (event) {
        var _this = this;
        console.log("delete route");
        console.log(event.currentTarget.id);
        var id = event.currentTarget.id
        axios.post("/delete", { id: id });
        _this.savedResults();

    },

    savedResults: function() {
        var _this = this;
        console.log("saved route");
        axios.get("/saved").then(function(docs) {
            console.log(docs);
        var content = [];
        console.log(docs);
        // console.log(docs)
        for (var i=0; i < docs.data.length; i++) {
            console.log(docs.data[i]);
            content.push(docs.data[i]);
        }
        console.log(content);
        // .data.i
        _this.setState({content: content});
        _this.content();
        });
        
    },

    render: function() {
        console.log(this.state.resultsArray.length);
        console.log(this.state.content);
        // {this.savedResults()}

        return (
            <div>
            <nav className="navbar navbar-default" role="navigation"><div className="container-fluid"><div className="navbar-header"><button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button><a className="navbar-brand" href="/">NYT-React</a></div><div className="collapse navbar-collapse navbar-ex1-collapse"><ul className="nav navbar-nav navbar-right"><li><a href="/">Search</a></li><li><a onClick={this.savedResults} href="javascript:void(0);">Saved Articles</a></li></ul></div></div></nav>
            
                {this.content()}
            </div>
            
        );
    }
});

// Export the component back for use in other files
module.exports = Body;
