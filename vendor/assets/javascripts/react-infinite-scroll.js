/*! react-infinite-scroll - v 0.1.0 - guillaumervls 2014-01-10 */
;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

module.exports = function (React) {
  if (React.addons && React.addons.InfiniteScroll) {
    return React.addons.InfiniteScroll;
  }
  React.addons = React.addons || {};
  React.addons.InfiniteScroll = React.createClass({
    getDefaultProps: function () {
      return {
        pageStart: 0,
        hasMore: false,
        loadMore: function () {},
        threshold: 250
      };
    },
    getInitialState: function () {
      this.pageLoaded = this.props.pageStart;
			return {};
    },
    componentDidMount: function () {
      this.attachScrollListener();
    },
    componentDidUpdate: function () {
      this.attachScrollListener();
    },
    render: function () {
      var props = this.props;
      return React.DOM.div(null, props.children, props.hasMore && props.loader);
    },
    scrollListener: function () {
      var el = this.getDOMNode();
      if (topPosition(el) + el.offsetHeight - ((window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop) - window.innerHeight < Number(this.props.threshold)) {
        this.props.loadMore(this.pageLoaded += 1);
        this.detachScrollListener();
      }
    },
    attachScrollListener: function () {
      if (!this.props.hasMore) {
        return;
      }
      window.addEventListener('scroll', this.scrollListener);
      this.scrollListener();
    },
    detachScrollListener: function () {
      window.removeEventListener('scroll', this.scrollListener);
    },
    componentWillUnmount: function () {
      this.detachScrollListener();
    }
  });
  return React.addons.InfiniteScroll;
};

},{}],2:[function(require,module,exports){
/*global define*/
var reactInfiniteScroll = require('./react-infinite-scroll');
if (typeof define === 'function' && define.amd) {
  define(['react'], function (React) {
    return reactInfiniteScroll(React);
  });
} else {
  window.React.addons = window.React.addons || {};
  window.React.addons.InfiniteScroll = reactInfiniteScroll(window.React);
}
},{"./react-infinite-scroll":1}]},{},[2])
;
