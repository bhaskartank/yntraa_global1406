import { useSelector } from "store";
import authRedux from "store/modules/auth";

const useIsInternalType = () => {
  const rootState = useSelector((state) => state);

  const userDetails = authRedux.getters.userDetails(rootState);

  return Boolean(userDetails?.is_internal);
};

export default useIsInternalType;
