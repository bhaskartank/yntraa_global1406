import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { socket } from "utils/socket";

export const name = "socket";

const initialState = {};
export const getters = {};

export const slice = createSlice({
  name,
  initialState,
  reducers: {},
});

export const { reducer } = slice;

export const actions = {
  executeSocketStatus:
    ({ taskId, callback, successMsg = "Resource Updated Successfully" }) =>
    async (dispatch) => {
      if (taskId) {
        try {
          await dispatch(actions.socketStatus({ taskId }));
          await callback();
          toast.success(successMsg);
        } catch (err) {
          console.error(err);
        }
      }
    },

  socketStatus:
    ({ taskId }) =>
    async () => {
      try {
        if (!taskId) {
          return Promise.reject(new Error("Invalid Task Id"));
        }
        socket.emit("join_room", { taskId });
        const promise = new Promise(function (resolve, reject) {
          socket.on(taskId, ({ data }) => {
            if (data?.status_code) {
              const statusCode = parseInt(data?.status_code);

              if (statusCode >= 200 && statusCode < 300) {
                return resolve(data);
              }
              if (statusCode >= 400) {
                return reject(data);
              }
            }
          });
        });
        return promise;
      } catch (err) {
        console.error(err);
      }
    },
};

export default {
  slice,
  actions,
  getters,
};
