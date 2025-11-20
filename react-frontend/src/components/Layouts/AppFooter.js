/* eslint-disable no-console */
import React from "react";
import FloatingButton from "./FloatingButton";
import { Tag } from "primereact/tag";
import { connect } from "react-redux";

const AppFooter = (props) => {
  return (
    <footer className="flex items-center justify-between w-full h-16 border-t border-gray-200 px-4 relative">
      <p className="text-sm text-gray-600">
        © 2024 Code Bridge Sdn. Bhd. All rights reserved.
      </p>
      {props.isLoggedIn ? (
        <div className="flex items-center ml-2">
          <FloatingButton />
        </div>
      ) : process.env.REACT_APP_ENV !== "prd" ? (
        <Tag
          className="mr-2"
          icon="pi pi-check"
          value={process.env.REACT_APP_ENV}
          severity="warning"
          rounded
        ></Tag>
      ) : null}
    </footer>
  );
};

const mapState = (state) => {
  const { isLoggedIn, user } = state.auth;
  return { isLoggedIn, user };
};

const mapDispatch = (dispatch) => ({
  logout: () => dispatch.auth.logout(),
  getCache: () => dispatch.cache.get(),
  setCache: (data) => dispatch.cache.set(data),
});

export default connect(mapState, mapDispatch)(AppFooter);
