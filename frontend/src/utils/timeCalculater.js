export function getTimeDifference(date) {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();

  // Calculate the time difference in milliseconds
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  // Calculate time difference in seconds
  const seconds = Math.floor(timeDiff / 1000);

  // Determine the appropriate time unit
  if (timeDiff < millisecondsPerMinute) {
    return "less than one minute";
  } else if (timeDiff < millisecondsPerHour) {
    const minutes = Math.floor(timeDiff / millisecondsPerMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (timeDiff < millisecondsPerDay) {
    const hours = Math.floor(timeDiff / millisecondsPerHour);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    const days = Math.floor(timeDiff / millisecondsPerDay);
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
}
export function getTimeDifferenceAbv(date) {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();

  // Calculate the time difference in milliseconds
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  // Determine the appropriate time unit
  if (timeDiff < millisecondsPerMinute) {
    return "now";
  } else if (timeDiff < millisecondsPerHour) {
    const minutes = Math.floor(timeDiff / millisecondsPerMinute);
    return `${minutes}m`;
  } else if (timeDiff < millisecondsPerDay) {
    const hours = Math.floor(timeDiff / millisecondsPerHour);
    return `${hours}h`;
  } else {
    const days = Math.floor(timeDiff / millisecondsPerDay);
    return `${days}d`;
  }
}
