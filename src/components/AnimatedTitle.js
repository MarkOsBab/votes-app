import React, { useEffect, useState } from 'react';
import { animated, useTrail } from '@react-spring/web';

const AnimatedTitle = ({ text }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    setItems(text.split(''));
  }, [text]);

  const trail = useTrail(items.length, {
    opacity: 1,
    transform: 'translate3d(0,0px,0px)',
    from: { opacity: 0, transform: 'translate3d(0,100px,0)' },
    config: { mass: 1, tension: 2000, friction: 100 },
  });

  return (
    <div className="flex space-x-1">
      {trail.map((props, index) => (
        <animated.span key={index} style={props}>
          {items[index] === ' ' ? '\u00A0' : items[index]}
        </animated.span>
      ))}
    </div>
  );
};

export default AnimatedTitle;