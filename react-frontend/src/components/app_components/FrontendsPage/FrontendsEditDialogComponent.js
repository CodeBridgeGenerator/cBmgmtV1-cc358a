/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


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

const FrontendsEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [firebase, setFirebase] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount firebase
                    client
                        .service("firebase")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleFirebaseId } })
                        .then((res) => {
                            setFirebase(res.data.map((e) => { return { name: e['projectId'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Firebase", type: "error", message: error.message || "Failed get firebase" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            projectName: _entity?.projectName,
domain: _entity?.domain,
env: _entity?.env,
firebase: _entity?.firebase?._id,
        };

        setLoading(true);
        try {
            
        await client.service("frontends").patch(_entity._id, _data);
        const eagerResult = await client
            .service("frontends")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "firebase",
                    service : "firebase",
                    select:["projectId"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info frontends updated successfully" });
        props.onEditResult(eagerResult.data[0]);
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

    const firebaseOptions = firebase.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Frontends" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="frontends-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectName">Project Name:</label>
                <InputText id="projectName" className="w-full mb-3 p-inputtext-sm" value={_entity?.projectName} onChange={(e) => setValByKey("projectName", e.target.value)}  />
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
                <label htmlFor="domain">Domain:</label>
                <InputText id="domain" className="w-full mb-3 p-inputtext-sm" value={_entity?.domain} onChange={(e) => setValByKey("domain", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["domain"]) && (
              <p className="m-0" key="error-domain">
                {error["domain"]}
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
                <label htmlFor="firebase">Firebase:</label>
                <Dropdown id="firebase" value={_entity?.firebase?._id} optionLabel="name" optionValue="value" options={firebaseOptions} onChange={(e) => setValByKey("firebase", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["firebase"]) && (
              <p className="m-0" key="error-firebase">
                {error["firebase"]}
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

export default connect(mapState, mapDispatch)(FrontendsEditDialogComponent);
