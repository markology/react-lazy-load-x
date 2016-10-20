import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';

import './style.css';

const onScrollRAF = {
  instance: () => {
    let _requestAnimationFrame = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.msRequestAnimationFrame
      || window.oRequestAnimationFrame
      // IE fallback
      || function(cb) {
        window.setTimeout(cb, 1000 / 60);
      };

    /* eslint-disable no-param-reassign */
    const doCallbackIfScrolled = ({
      callback,
      lastPos,
    }) => {
      const pageY = window.pageYOffset;
      // call self on next frame if scroll pos unchanged
      if (lastPos === pageY) {
        // cond to term loop if instance().stop called
        if (_requestAnimationFrame) {
          return _requestAnimationFrame(
            doCallbackIfScrolled.bind(null, {callback, lastPos})
          );
        }
        return void 0;
      }
      // reassign to current scroll pos
      lastPos = pageY;
      // call the work func
      if (_requestAnimationFrame) {
        callback();
      }

      // cond to term loop if instance().stop called
      if (_requestAnimationFrame) {
        return _requestAnimationFrame(
          doCallbackIfScrolled.bind(null, {callback, lastPos})
        );
      }
      return void 0;
    };

    const scroll = callback => {
      // initiate to non-zero so work func runs on scroll pos 0
      const startPos = -1;
      // start the RAF loop
      doCallbackIfScrolled({callback, lastPos: startPos});
    };

    const stop = () => {
      _requestAnimationFrame = null;
    };

    return {
      scroll,
      stop,
    };
  },
};

function test(lazyLoadHandler) {
  const raf = onScrollRAF.instance();
  raf.scroll(lazyLoadHandler);
}

class Application extends Component {
  constructor(props) {
    super(props);
    this.raf = this.raf.bind(this);
  }
  componentDidMount() {
    this.raf = onScrollRAF.instance();
  }

  componentWillUnmount() {
    this.raf.cancel();
  }
  render() {
    return (
      <div>
        Scroll to load images.
        <div className="filler" />
        <LazyLoad height={362} offsetVertical={300}
          onLoad={() => console.warn('look ma I have been lazyloaded!')}
          onContentVisible={() => console.warn('look maim asdasdasudasd!')}
          defaultScrollEvent={false}
          setScroll={test}
        >

          <img src='http://apod.nasa.gov/apod/image/1502/HDR_MVMQ20Feb2015ouellet1024.jpg' />
        </LazyLoad>
        <div className="filler" />
      </div>
    );
  }
}

export default Application;
