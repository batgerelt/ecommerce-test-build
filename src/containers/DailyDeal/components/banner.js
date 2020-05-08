import React, { useState, useEffect } from 'react';

const IntervalExample = ({
  timercountdown,
}) => {
  const [seconds, setSeconds] = useState(timercountdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sub_contents" tyle={{ width: "768px !important" }}>
      <div id="bg_sub" className="bg_obanjang" />
      <div className="header_obanjang notranslate" style={{ display: "block" }}>
        <div className="time_counter">
          <em className={`num${Math.floor(seconds / 3600) < 0 ? 0 : Math.floor(Math.floor(seconds / 3600) / 10)}`} />
          <em className={`num${Math.floor(Math.floor(seconds / 3600) % 10)}`} />

          <em className="color" />

          <em className={`num${Math.floor((seconds % 3600) / 60) < 10 ? 0 : Math.floor(Math.floor(Math.floor((seconds % 3600) / 60) / 10))}`} />
          <em className={`num${Math.floor(Math.floor((seconds % 3600) / 60) % 10)}`} />

          <em className="color" />

          <em className={`num${Math.floor((seconds % 3600) % 60) < 10 ? 0 : Math.floor(Math.floor((seconds % 3600) % 60) / 10)}`} />
          <em className={`num${Math.floor(Math.floor((seconds % 3600) % 60) % 10)}`} />
        </div>
      </div>
    </div>
  );
};

export default IntervalExample;
