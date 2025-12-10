import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const BackendsCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [frontend, setFrontend] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [frontend, contract],
        setError,
      );
    }
    set_entity({ ...init });
    setError({});
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      projectName: _entity?.projectName,
      port: _entity?.port,
      domain: _entity?.domain,
      env: _entity?.env,
      frontend: _entity?.frontend?._id,
      contract: _entity?.contract?._id,
      dir: _entity?.dir,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("backends").create(_data);
      const eagerResult = await client.service("backends").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "frontend",
              service: "frontends",
              select: ["projectName"],
            },
            {
              path: "contract",
              service: "contract",
              select: ["crm"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Backends updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Backends",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount frontends
    client
      .service("frontends")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleFrontendsId,
        },
      })
      .then((res) => {
        setFrontend(
          res.data.map((e) => {
            return { name: e["projectName"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Frontends",
          type: "error",
          message: error.message || "Failed get frontends",
        });
      });
  }, []);

  useEffect(() => {
    // on mount contract
    client
      .service("contract")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleContractId,
        },
      })
      .then((res) => {
        setContract(
          res.data.map((e) => {
            return { name: e["crm"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Contract",
          type: "error",
          message: error.message || "Failed get contract",
        });
      });
  }, []);

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

  const frontendOptions = frontend.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const contractOptions = contract.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Backends"
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
        role="backends-create-dialog-component"
      >
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
            {!_.isEmpty(error["projectName"]) ? (
              <p className="m-0" key="error-projectName">
                {error["projectName"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="port">port:</label>
            <InputNumber
              id="port"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.port}
              onChange={(e) => setValByKey("port", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["port"]) ? (
              <p className="m-0" key="error-port">
                {error["port"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="domain">domain:</label>
            <InputText
              id="domain"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.domain}
              onChange={(e) => setValByKey("domain", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["domain"]) ? (
              <p className="m-0" key="error-domain">
                {error["domain"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="env">env:</label>
            <InputText
              id="env"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.env}
              onChange={(e) => setValByKey("env", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["env"]) ? (
              <p className="m-0" key="error-env">
                {error["env"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="frontend">frontend:</label>
            <Dropdown
              id="frontend"
              value={_entity?.frontend?._id}
              optionLabel="name"
              optionValue="value"
              options={frontendOptions}
              onChange={(e) => setValByKey("frontend", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["frontend"]) ? (
              <p className="m-0" key="error-frontend">
                {error["frontend"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="contract">Contract:</label>
            <Dropdown
              id="contract"
              value={_entity?.contract?._id}
              optionLabel="name"
              optionValue="value"
              options={contractOptions}
              onChange={(e) => setValByKey("contract", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["contract"]) ? (
              <p className="m-0" key="error-contract">
                {error["contract"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="dir">Dir:</label>
            <InputText
              id="dir"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.dir}
              onChange={(e) => setValByKey("dir", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["dir"]) ? (
              <p className="m-0" key="error-dir">
                {error["dir"]}
              </p>
            ) : null}
          </small>
        </div>
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

export default connect(mapState, mapDispatch)(BackendsCreateDialogComponent);
