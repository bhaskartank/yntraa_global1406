import get from "lodash/get";
import moment from "moment";

export const apiHeaderTotalCount = (headers): number => {
  return headers && !!headers["x-total-count"] ? parseInt(headers["x-total-count"], 10) : 0;
};

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

export function formatDate(timestamp, type = "datetime", unix = false) {
  if (!timestamp) return "";

  let dateFormat = "";
  let timeFormat = "";

  if (unix) {
    timestamp = moment(timestamp)?.unix();
  }

  dateFormat = moment.unix(timestamp).format("DD-MMM-YYYY");
  timeFormat = moment.unix(timestamp).format("hh:mm:ss a");

  if (type === "date") {
    return dateFormat;
  } else if (type === "time") {
    return timeFormat;
  } else {
    return `${dateFormat} ${timeFormat}`;
  }
}

export const validateEnv = (env = "", compareWith = "true"): boolean => env === compareWith;

export const stringAvatar = (name = "") => {
  const nameSplit = name?.split(" ");
  const children = get(nameSplit, "[0][0]", "")?.toUpperCase() + get(nameSplit, "[1][0]", "")?.toUpperCase();

  return { sx: { bgcolor: "secondary.main" }, children };
};

export const getOsImgUrl = (imageName = "") => {
  const images = require.context("../../public/images", false, /\.png$/);
  if (images.keys().includes("./" + "icon-" + imageName.toLowerCase() + "-black.png")) {
    return images("./" + "icon-" + imageName.toLowerCase() + "-black.png");
  } else {
    return images("./" + "icon-generic-black.png");
  }
};

export const findSubstringIndexes = (string: string, substring: string) => {
  const indexes = [];
  let currentIndex = string.indexOf(substring);

  while (currentIndex !== -1) {
    indexes.push(currentIndex);
    currentIndex = string.indexOf(substring, currentIndex + 1);
  }

  return indexes;
};

export const cidrToRange  = (CIDR) => {
  //  Beginning IP aDDress
  const beg = CIDR.substr(CIDR, CIDR.indexOf("/"));
  let end = beg;
  const off = (1 << (32 - parseInt(CIDR.substr(CIDR.indexOf("/") + 1)))) - 1;
  const sub = beg.split(".").map(function (a) {
    return parseInt(a);
  });

  // An IPv4 aDDress is just an UInt32...
  const buf = new ArrayBuffer(4); // 4 octets
  const i32 = new Uint32Array(buf);

  // Get the UInt32, and add the bit difference
  i32[0] = (sub[0] << 24) + (sub[1] << 16) + (sub[2] << 8) + sub[3] + off;

  // Recombine into an IPv4 string:
  end = Array.apply([], new Uint8Array(buf)).reverse().join(".");
  return [beg, end];
}