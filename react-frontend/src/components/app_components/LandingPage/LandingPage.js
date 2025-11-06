import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "primereact/button";

const LandingPage = (props) => {
  const uuid = localStorage.getItem("uuid");
  const [uID, setUID] = useState(null);
  useEffect(() => {
    if (!uuid) {
      props.setUUID();
      props.getSetApiKey();
    } else {
      setUID(uuid);
    }
  }, [uID]);

  return (
    <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">
        <div className="text-center lg:text-right">
          <div className="mt-6 mb-3 font-bold text-6xl text-900">
            User id {props.webUserId}
            <br/>
            User uuid {uuid}
          </div>
          <p className="text-700 text-3xl mt-0 mb-6">
            Sorry, we couldn&apos;t find the page.
          </p>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { webUserId } = state.apiKey;
  return { user, isLoggedIn, webUserId };
};

const mapDispatch = (dispatch) => ({
  setUUID: () => dispatch.apiKey.setUUID(),
  getSetApiKey: () => dispatch.apiKey.getSetApiKey(),
});

export default connect(mapState, mapDispatch)(LandingPage);
