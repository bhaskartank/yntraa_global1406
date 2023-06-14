import get from "lodash/get";

const stringAvatar = (name = "user name") => {
  const nameSplit = name?.split(" ");
  const children = get(nameSplit, "[0][0]", "")?.toUpperCase() + get(nameSplit, "[1][0]", "")?.toUpperCase();

  return { sx: { bgcolor: "secondary.main" }, children };
};

export default stringAvatar;
