import axios from "axios";

export const apiKey = {
  state: {
    authentication: {
      strategy: "",
      accessToken: "",
      payload: {
        iat: 0,
        exp: 0,
        aud: "",
        iss: "",
        sub: "",
        jti: "",
      },
    },
    webUserId: "",
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    update(state, apiKeyOptions) {
      let toReturn = { ...state, ...apiKeyOptions };
      return toReturn;
    },
  },
  effects: (dispatch) => ({
    /////////////////////////
    //// GET USER APIKEY ////
    /////////////////////////
    async getSetApiKey(_, reduxState) {
      return new Promise((resolve, reject) => {
        // const { user } = reduxState.auth;
        const url = `${process.env.REACT_APP_SERVER_URL}/consumer/apiKey`;
        axios
          .get(url)
          .then((results) => {
            console.log("state", reduxState);
            console.log("results", results);
            this.update(results);
            resolve(results);
          })
          .catch((error) => {
            console.error("error", error);
            reject(error);
          });
      });
    },
    isExpired(_, reduxState) {
      ///////////////////////////////
      //// IS USER APIKEY EXPIRED////
      ///////////////////////////////
      const token = this.authentication.accessToken;
      const exp = this.authentication.payload.exp;
      if (!token || !exp) {
        return true;
      }
      try {
        const currentTime = Date.now() / 1000; // Current time in seconds since epoch
        return exp < currentTime; // Compare token expiration with current time
      } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Handle invalid token by considering it expired
      }
    },
    async execQuery(service, data, id, method, reduxState) {
      /////////////////////////
      //// EXEC USER QUERY ////
      /////////////////////////
      return new Promise((resolve, reject) => {
        const { user } = reduxState.auth;
        const url = `${process.env.REACT_APP_SERVER_URL}/consumer/query`;
        const token = this.authentication.accessToken;
        const body = { service, data, method, id, user, token };
        try {
          const results = axios.post(url, body);
          resolve(results);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    },
    setUUID() {
      let uuid = localStorage.getItem("uuid");
      this.update({ webUserId: uuid });
      if (
        !uuid &&
        typeof window !== "undefined" &&
        window.crypto &&
        window.crypto.randomUUID
      ) {
        uuid = window.crypto.randomUUID();
        this.update({ webUserId: uuid });
        localStorage.setItem("uuid", uuid);
      }
    },
  }),
};
