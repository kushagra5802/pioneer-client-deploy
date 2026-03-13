const formatTimeDifference = (timeString) => {
  // Parse the time string into a Date object
  const time = new Date(timeString);

  // Check if the parsed time is valid
  if (isNaN(time.getTime())) {
    return "";
  }

  // Calculate the time difference
  const currentTime = new Date();
  const timeDifference = currentTime - time;

  // Convert milliseconds to minutes and hours
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  // Format the time difference
  if (hoursDifference >= 1) {
    return `${hoursDifference} hr`;
  } else {
    return `${minutesDifference} m`;
  }
};
export default formatTimeDifference;
