import axios from "axios";

export const apiKey = {
  state: {
    webUserId: "",
  },
  reducers: {
    update(state, apiKeyOptions) {
      let toReturn = { ...state, ...apiKeyOptions };
      return toReturn;
    },
  },
  effects: (dispatch) => ({
    async getData(body, reduxState) {
      /////////////////////////
      //// GET DATA QUERY ////
      /////////////////////////
      return new Promise((resolve, reject) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/consumer/read`;
        axios
          .post(url, body)
          .then((results) => resolve(results))
          .catch((error) => {
            reject(error);
          });
      });
    },

    async setData(body, reduxState) {
      /////////////////////////
      //// SET DATA QUERY ////
      /////////////////////////
      return new Promise((resolve, reject) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/consumer/cupd`;
        axios
          .post(url, body)
          .then((results) => resolve(results))
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUUID(_, reduxState) {
      let uuid = localStorage.getItem("uuid");
      if (uuid) this.update({ webUserId: uuid });
      if (
        !uuid &&
        typeof window !== "undefined" &&
        window.crypto &&
        window.crypto.randomUUID
      ) {
        uuid = window.crypto.randomUUID();
        this.update({ webUserId: uuid });
        localStorage.setItem("uuid", uuid);
      } else console.log(" uuid", uuid);
    },
  }),
};
