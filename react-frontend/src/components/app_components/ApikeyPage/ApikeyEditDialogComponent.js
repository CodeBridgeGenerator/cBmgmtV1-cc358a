/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const ApikeyEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    let _data = {
      apikey: _entity?.apikey,
      projectName: _entity?.projectName,
      requests: _entity?.requests,
      duration: _entity?.duration,
      serviceName: _entity?.serviceName,
      active: _entity?.active,
    };

    setLoading(true);
    try {
      const result = await client.service("apikey").patch(_entity._id, _data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info apikey updated successfully",
      });
      props.onEditResult(result);
    } catch (error) {
      console.debug("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update info",
      );
      props.alert({
        type: "error",
        title: "Edit info",
        message: "Failed to update info",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  return (
    <Dialog
      header="Edit Apikey"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max scalein animation-ease-in-out animation-duration-1000"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="apikey-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="apikey">APIKEY:</label>
            <InputText
              id="apikey"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.apikey}
              onChange={(e) => setValByKey("apikey", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["apikey"]) && (
              <p className="m-0" key="error-apikey">
                {error["apikey"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="projectName">projectName:</label>
            <InputText
              id="projectName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.projectName}
              onChange={(e) => setValByKey("projectName", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["projectName"]) && (
              <p className="m-0" key="error-projectName">
                {error["projectName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="requests">requests:</label>
            <InputNumber
              id="requests"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.requests}
              onChange={(e) => setValByKey("requests", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["requests"]) && (
              <p className="m-0" key="error-requests">
                {error["requests"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="duration">duration:</label>
            <InputNumber
              id="duration"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.duration}
              onChange={(e) => setValByKey("duration", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["duration"]) && (
              <p className="m-0" key="error-duration">
                {error["duration"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="serviceName">serviceName:</label>
            <InputText
              id="serviceName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.serviceName}
              onChange={(e) => setValByKey("serviceName", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["serviceName"]) && (
              <p className="m-0" key="error-serviceName">
                {error["serviceName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field flex">
          <span className="align-items-center">
            <label htmlFor="active">active:</label>
            <Checkbox
              id="active"
              className="ml-3"
              checked={_entity?.active}
              onChange={(e) => setValByKey("active", e.checked)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["active"]) && (
              <p className="m-0" key="error-active">
                {error["active"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12">&nbsp;</div>
        <small className="p-error">
          {Array.isArray(Object.keys(error))
            ? Object.keys(error).map((e, i) => (
                <p className="m-0" key={i}>
                  {e}: {error[e]}
                </p>
              ))
            : error}
        </small>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ApikeyEditDialogComponent);
