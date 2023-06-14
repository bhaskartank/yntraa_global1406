import isEmpty from "lodash/isEmpty";

export const validateEnv = (env: string | boolean = "", compareWith: string | boolean | null = "true", checkEmpty: boolean | null = null): boolean => {
  // condition to check if env string is empty, validate only when checkEmpty is true
  if (checkEmpty !== null && checkEmpty) return isEmpty(env);

  return env === compareWith;
};

export const apiHeaderTotalCount = (headers): number => {
  return headers && !!headers["x-total-count"] ? parseInt(headers["x-total-count"], 10) : 0;
};

export function getOsImgUrl(imageName = "") {
  const images = require.context("../../public/images", false, /\.png$/);
  if (images.keys().includes("./" + "icon-" + imageName.toLowerCase() + "-black.png")) {
    return images("./" + "icon-" + imageName.toLowerCase() + "-black.png");
  } else {
    return images("./" + "icon-generic-black.png");
  }
}

export const getDateDifference = (startDate, endDate) => {
  // Get the difference in milliseconds between the two dates
  let diff = endDate - startDate;

  // Calculate the number of years, months, days, hours, minutes, and seconds
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  diff -= years * (1000 * 60 * 60 * 24 * 365.25);
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.436875));
  diff -= months * (1000 * 60 * 60 * 24 * 30.436875);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);

  // Return the difference as an object
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const getAge = (startEpoch): any => {
  const startDate = new Date(startEpoch * 1000);
  const todayDate = new Date();

  const { years, months, days, hours, minutes } = getDateDifference(startDate, todayDate);

  return `${years ? `${years} years,` : ""} ${months ? `${months} months,` : ""} ${days ? `${days} days,` : ""} ${hours ? `${hours} hours,` : ""} ${
    minutes ? `${minutes} minutes` : ""
  }`;
};

export const errorHandler = (fn) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(error);
    }
  };
};
