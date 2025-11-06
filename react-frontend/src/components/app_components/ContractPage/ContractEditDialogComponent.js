/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

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

const ContractEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [crm, setCrm] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    //on mount crm
    client
      .service("crm")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCrmId,
        },
      })
      .then((res) => {
        setCrm(
          res.data.map((e) => {
            return { name: e["name"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Crm",
          type: "error",
          message: error.message || "Failed get crm",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      crm: _entity?.crm?._id,
      po: _entity?.po,
      start: _entity?.start,
      uatDate: _entity?.uatDate,
      migrationDate: _entity?.migrationDate,
      supportDate: _entity?.supportDate,
    };

    setLoading(true);
    try {
      await client.service("contract").patch(_entity._id, _data);
      const eagerResult = await client.service("contract").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "crm",
              service: "crm",
              select: ["name"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info contract updated successfully",
      });
      props.onEditResult(eagerResult.data[0]);
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

  const crmOptions = crm.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Contract"
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
        role="contract-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="crm">CRM:</label>
            <Dropdown
              id="crm"
              value={_entity?.crm?._id}
              optionLabel="name"
              optionValue="value"
              options={crmOptions}
              onChange={(e) => setValByKey("crm", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["crm"]) && (
              <p className="m-0" key="error-crm">
                {error["crm"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="po">PO:</label>
            <InputText
              id="po"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.po}
              onChange={(e) => setValByKey("po", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["po"]) && (
              <p className="m-0" key="error-po">
                {error["po"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="start">Start:</label>
            <Calendar
              id="start"
              value={_entity?.start ? new Date(_entity?.start) : null}
              dateFormat="dd/mm/yy"
              onChange={(e) => setValByKey("start", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["start"]) && (
              <p className="m-0" key="error-start">
                {error["start"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="uatDate">UAT Date:</label>
            <Calendar
              id="uatDate"
              value={_entity?.uatDate ? new Date(_entity?.uatDate) : null}
              dateFormat="dd/mm/yy"
              onChange={(e) => setValByKey("uatDate", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["uatDate"]) && (
              <p className="m-0" key="error-uatDate">
                {error["uatDate"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="migrationDate">Migration Date:</label>
            <Calendar
              id="migrationDate"
              value={
                _entity?.migrationDate ? new Date(_entity?.migrationDate) : null
              }
              dateFormat="dd/mm/yy"
              onChange={(e) => setValByKey("migrationDate", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["migrationDate"]) && (
              <p className="m-0" key="error-migrationDate">
                {error["migrationDate"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="supportDate">Support Date:</label>
            <Calendar
              id="supportDate"
              value={
                _entity?.supportDate ? new Date(_entity?.supportDate) : null
              }
              dateFormat="dd/mm/yy"
              onChange={(e) => setValByKey("supportDate", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["supportDate"]) && (
              <p className="m-0" key="error-supportDate">
                {error["supportDate"]}
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

export default connect(mapState, mapDispatch)(ContractEditDialogComponent);
