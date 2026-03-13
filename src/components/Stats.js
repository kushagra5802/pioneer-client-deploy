import React from "react";
import "../styles/overView.css";
import { useEffect } from "react";
const Stats = (props) => {
  useEffect(() => {
    const element = document.getElementById(props.title);
    if (element) {
      animateValue(element, 0, parseInt(props.stat), 600);
    }
  }, [props.stat, props.title]);

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    end = isNaN(end) ? 0 : end;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  let percentColor = "#3bbee8";
  let formattedPercent = props.percent;
    if (props.percent > 0) {
      percentColor = "green";
      formattedPercent = Math.abs(props.percent) + "%";
    } else if (props.percent < 0) {
      percentColor = "red";
      formattedPercent = Math.abs(props.percent) + "%";
    }else if (props.percent === 0) {
      formattedPercent = formattedPercent + "%";
    }
  return (
    <>
      <div className='overview-stats flex flex-row '>
        <div className='stats-icon'>
          <img src={props.icon} alt='' />
        </div>
        <div className='stats-wrapper flex items-center justify-around flex-auto'>
          <div className='stats-content'>
            <div className='float-child'>
              <p className='stats-stat' id={props.title}>
                {props.stat}
              </p>
            </div>
            <p className='stats-title'>{props.title}</p>
          </div>
          <div className='float-container'>
            <div className='float-child-arrow'>
              <div className='change-icon'>
                <i>{props.changeIcon}</i>
              </div>
            </div>
            <div className='float-child-arrow'>
              <p className='stats-percent' style={{ color: percentColor }}>{formattedPercent}</p>
            </div>
          </div>
        </div>
        <div className='stats-wrapper flex items-center justify-center'>
          <div className='stats-content'>
            <div className='float-child'>
              <p className='stats-stat text-center'>{props.stat1}</p>
            </div>
            <p className='stats-title'>{props.title1}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
