/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';


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

const FirebaseEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

    

    const onSave = async () => {
        let _data = {
            projectId: _entity?.projectId,
url: _entity?.url,
customUrl: _entity?.customUrl,
key: _entity?.key,
env: _entity?.env,
projectNumber: _entity?.projectNumber,
webApiKey: _entity?.webApiKey,
appId: _entity?.appId,
        };

        setLoading(true);
        try {
            
        const result = await client.service("firebase").patch(_entity._id, _data);
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info firebase updated successfully" });
        props.onEditResult(result);
        
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    

    return (
        <Dialog header="Edit Firebase" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="firebase-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectId">Project ID:</label>
                <InputText id="projectId" className="w-full mb-3 p-inputtext-sm" value={_entity?.projectId} onChange={(e) => setValByKey("projectId", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectId"]) && (
              <p className="m-0" key="error-projectId">
                {error["projectId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="url">URL:</label>
                <InputText id="url" className="w-full mb-3 p-inputtext-sm" value={_entity?.url} onChange={(e) => setValByKey("url", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["url"]) && (
              <p className="m-0" key="error-url">
                {error["url"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="customUrl">Custom Url:</label>
                <InputText id="customUrl" className="w-full mb-3 p-inputtext-sm" value={_entity?.customUrl} onChange={(e) => setValByKey("customUrl", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customUrl"]) && (
              <p className="m-0" key="error-customUrl">
                {error["customUrl"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="key">Key:</label>
                <InputText id="key" className="w-full mb-3 p-inputtext-sm" value={_entity?.key} onChange={(e) => setValByKey("key", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["key"]) && (
              <p className="m-0" key="error-key">
                {error["key"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="env">env:</label>
                <InputText id="env" className="w-full mb-3 p-inputtext-sm" value={_entity?.env} onChange={(e) => setValByKey("env", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["env"]) && (
              <p className="m-0" key="error-env">
                {error["env"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectNumber">Project number:</label>
                <InputNumber id="projectNumber" className="w-full mb-3 p-inputtext-sm" value={_entity?.projectNumber} onChange={(e) => setValByKey("projectNumber", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectNumber"]) && (
              <p className="m-0" key="error-projectNumber">
                {error["projectNumber"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="webApiKey">Web API Key:</label>
                <InputText id="webApiKey" className="w-full mb-3 p-inputtext-sm" value={_entity?.webApiKey} onChange={(e) => setValByKey("webApiKey", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["webApiKey"]) && (
              <p className="m-0" key="error-webApiKey">
                {error["webApiKey"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="appId">App ID:</label>
                <InputText id="appId" className="w-full mb-3 p-inputtext-sm" value={_entity?.appId} onChange={(e) => setValByKey("appId", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["appId"]) && (
              <p className="m-0" key="error-appId">
                {error["appId"]}
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

export default connect(mapState, mapDispatch)(FirebaseEditDialogComponent);
