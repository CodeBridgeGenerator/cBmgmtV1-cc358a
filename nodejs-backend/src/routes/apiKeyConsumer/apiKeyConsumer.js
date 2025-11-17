const axios = require("axios");
const _ = require("lodash");

// I am the consumer of the API

async function getData(request, response) {
  try {
    const apiAccess = request.appInstance.get("apiAccess");
    let accessToken = request.appInstance.get("accessToken");
    if (!accessToken || !accessToken.accessToken)
      accessToken = await getAccessToken(request);

    const { service, query } = request.body;

    let qStr = null;
    if (!_.isEmpty(query)) {
      qStr = Object.entries(query)
        .map((v) => `${v[0]}=${v[1]}`)
        .join("&");
    }

    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    };
    let results = null;
    if (!qStr) {
      const url = `${apiAccess.endPoint}/${service}`;
      results = await axios.get(url, headers);
    } else {
      const url = `${apiAccess.endPoint}/${service}?${qStr}`;
      results = await axios.get(url, headers);
    }
    return response.status(200).json(results.data.data);
  } catch (error) {
    console.log(error);
    const results = { status: false, message: error.message };
    return response.status(501).json(results);
  }
}

async function setData(request, response) {
  try {
    const apiAccess = request.appInstance.get("apiAccess");
    let accessToken = request.appInstance.get("accessToken");
    if (!accessToken || !accessToken.accessToken)
      accessToken = await getAccessToken(request);

    const { service, data, method, id } = request.body;
    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    };
    let results = null;
    if (!id) {
      if (method === "post") {
        results = await axios.post(
          `${apiAccess.endPoint}/${service}`,
          data,
          headers,
        );
      }
    } else {
      if (method === "update") {
        results = await axios.update(
          `${apiAccess.endPoint}/${service}/${id}`,
          data,
          headers,
        );
      } else if (method === "patch") {
        results = await axios.patch(
          `${apiAccess.endPoint}/${service}/${id}`,
          data,
          headers,
        );
      } else if (method === "remove") {
        results = await axios.delete(
          `${apiAccess.endPoint}/${service}/${id}`,
          data,
          headers,
        );
      }
    }

    results = { status: true, message: method };
    return response.status(200).json(results);
  } catch (error) {
    console.log(error);
    let results = { status: false, message: error.message };
    return response.status(501).json(results);
  }
}

async function getAccessToken(request) {
  try {
    const accessToken = request.appInstance.get("accessToken");
    if (!accessToken || !accessToken.accessToken) {
      const results = await fetchToken(request);
      if (results["status"]) {
        request.appInstance.set("accessToken", results);
        return results;
      }
    }

    if (isExpired(accessToken)) {
      const results = await fetchToken(request);
      if (!results["status"]) {
        request.appInstance.set("accessToken", results);
        return results;
      }
    }
    return {
      status: false,
      message: "access token fetch failed",
      results: accessToken,
    };
  } catch (error) {
    console.log(error.message);
    return { status: false, message: error.message };
  }
}

async function fetchToken(request) {
  try {
    const apiAccess = request.appInstance.get("apiAccess");
    const body = {
      strategy: "api-key",
      user: apiAccess.userAccount,
    };
    const headers = {
      headers: {
        "x-api-key": apiAccess.apiKey,
      },
    };
    const auth = await axios.post(
      `${apiAccess.endPoint}/authentication`,
      body,
      headers,
    );
    const results = auth.data;
    results["status"] = true;

    return results;
  } catch (error) {
    console.log(error.message);
    return { status: false, message: error.message };
  }
}

function isExpired(accessToken) {
  ///////////////////////////////
  //// IS USER APIKEY EXPIRED////
  ///////////////////////////////
  const token = accessToken.accessToken;
  const exp = accessToken.authentication.payload.exp;
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
}

module.exports = { getData, setData };
