import React, { useState, useEffect } from 'react';

function Component({
  timercountdown,
}) {
  const [seconds, setSeconds] = useState(11);
  useEffect(() => {
    setSeconds(timercountdown);
    const interval = setInterval(() => {
      setSeconds(timercountdown => timercountdown - 1);
      console.log(seconds, timercountdown);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sub_contents" tyle={{ width: "768px !important" }}>
      <div id="bg_sub" className="bg_obanjang" />
      <div className="header_obanjang notranslate" style={{ display: "block" }} >
        <div className="time_counter">
          <em className="num0" />
          <em className="num0" />

          <em className="color" />

          <em className="num0" />
          <em className="num0" />

          <em className="color" />

          <em className="num0" />
          <em className={`num${seconds}`} />
        </div>
      </div>
    </div>
  );
}

export default Component;
