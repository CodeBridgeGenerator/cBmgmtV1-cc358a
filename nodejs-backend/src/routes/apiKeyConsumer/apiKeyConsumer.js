const axios = require("axios");
// I am the consumer of the API
async function getAccessToken(request) {
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
      `${apiAccess.endPoint}/"authentication"`,
      body,
      headers,
    );
    console.log("auth", auth);
    return auth;
  } catch (error) {
    console.log(error);
  }
}

async function getData(request) {
  try {
    const apiAccess = request.appInstance.get("apiAccess");
    console.log(request.body);
    const { service, data, method, user, id, token } = request.body;
    console.log(user);

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let results = null;
    if (method === "post") {
      results = await axios.post(
        `${apiAccess.endPoint}/${service}`,
        data,
        headers,
      );
    } else if (method === "get") {
      results = await axios.get(`${apiAccess.endPoint}/${service}`, headers);
    } else if (method === "find") {
      const qStr = Object.entries(data)
        .map((v) => `${v[0]}=${v[1]}`)
        .join("&");
      console.log(qStr);
      results = await axios.get(
        `${apiAccess.endPoint}/${service}?${qStr}`,
        headers,
      );
    } else if (method === "update") {
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
    } else {
      const qStr = Object.entries(data)
        .map((v) => `${v[0]}=${v[1]}`)
        .join("&");
      console.log(qStr);
      results = await axios.get(
        `${apiAccess.endPoint}/${service}?${qStr}`,
        headers,
      );
    }
    results = await axios.post(
      `${apiAccess.endPoint}/${service}`,
      data,
      headers,
    );
    console.log("results", results);
    return results;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAccessToken, getData };
