import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

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

const CrmCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [company, setCompany] = useState([]);
  const [person, setPerson] = useState([]);
  const [opportunity, setOpportunity] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [company, person, opportunity],
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
      name: _entity?.name,
      company: _entity?.company?._id,
      person: _entity?.person?._id,
      opportunity: _entity?.opportunity?._id,
      appCost: _entity?.appCost,
      supportCost: _entity?.supportCost,
      otherCost: _entity?.otherCost,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("crm").create(_data);
      const eagerResult = await client.service("crm").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "company",
              service: "companies",
              select: ["name"],
            },
            {
              path: "person",
              service: "branches",
              select: ["name"],
            },
            {
              path: "opportunity",
              service: "opportunity",
              select: ["states"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Crm updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Crm",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount companies
    client
      .service("companies")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCompaniesId,
        },
      })
      .then((res) => {
        setCompany(
          res.data.map((e) => {
            return { name: e["name"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Companies",
          type: "error",
          message: error.message || "Failed get companies",
        });
      });
  }, []);

  useEffect(() => {
    // on mount branches
    client
      .service("branches")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleBranchesId,
        },
      })
      .then((res) => {
        setPerson(
          res.data.map((e) => {
            return { name: e["name"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Branches",
          type: "error",
          message: error.message || "Failed get branches",
        });
      });
  }, []);

  useEffect(() => {
    // on mount opportunity
    client
      .service("opportunity")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleOpportunityId,
        },
      })
      .then((res) => {
        setOpportunity(
          res.data.map((e) => {
            return { name: e["states"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Opportunity",
          type: "error",
          message: error.message || "Failed get opportunity",
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

  const companyOptions = company.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const personOptions = person.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const opportunityOptions = opportunity.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Crm"
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
        role="crm-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="name">Name:</label>
            <InputText
              id="name"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.name}
              onChange={(e) => setValByKey("name", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["name"]) ? (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="company">Company:</label>
            <Dropdown
              id="company"
              value={_entity?.company?._id}
              optionLabel="name"
              optionValue="value"
              options={companyOptions}
              onChange={(e) => setValByKey("company", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["company"]) ? (
              <p className="m-0" key="error-company">
                {error["company"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="person">Person:</label>
            <Dropdown
              id="person"
              value={_entity?.person?._id}
              optionLabel="name"
              optionValue="value"
              options={personOptions}
              onChange={(e) => setValByKey("person", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["person"]) ? (
              <p className="m-0" key="error-person">
                {error["person"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="opportunity">Opportunity:</label>
            <Dropdown
              id="opportunity"
              value={_entity?.opportunity?._id}
              optionLabel="name"
              optionValue="value"
              options={opportunityOptions}
              onChange={(e) => setValByKey("opportunity", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["opportunity"]) ? (
              <p className="m-0" key="error-opportunity">
                {error["opportunity"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="appCost">App Cost:</label>
            <InputNumber
              id="appCost"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.appCost}
              onChange={(e) => setValByKey("appCost", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["appCost"]) ? (
              <p className="m-0" key="error-appCost">
                {error["appCost"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="supportCost">Support Cost:</label>
            <InputNumber
              id="supportCost"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.supportCost}
              onChange={(e) => setValByKey("supportCost", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["supportCost"]) ? (
              <p className="m-0" key="error-supportCost">
                {error["supportCost"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="otherCost">Other Cost:</label>
            <InputNumber
              id="otherCost"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.otherCost}
              onChange={(e) => setValByKey("otherCost", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["otherCost"]) ? (
              <p className="m-0" key="error-otherCost">
                {error["otherCost"]}
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

export default connect(mapState, mapDispatch)(CrmCreateDialogComponent);
