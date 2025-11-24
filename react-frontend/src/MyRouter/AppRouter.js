import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleCrmPage from "../components/app_components/CrmPage/SingleCrmPage";
import CrmProjectLayoutPage from "../components/app_components/CrmPage/CrmProjectLayoutPage";
import SingleOpportunityPage from "../components/app_components/OpportunityPage/SingleOpportunityPage";
import OpportunityProjectLayoutPage from "../components/app_components/OpportunityPage/OpportunityProjectLayoutPage";
import SingleContractPage from "../components/app_components/ContractPage/SingleContractPage";
import ContractProjectLayoutPage from "../components/app_components/ContractPage/ContractProjectLayoutPage";
import SingleApikeyPage from "../components/app_components/ApikeyPage/SingleApikeyPage";
import ApikeyProjectLayoutPage from "../components/app_components/ApikeyPage/ApikeyProjectLayoutPage";
import SingleBackendsPage from "../components/app_components/BackendsPage/SingleBackendsPage";
import BackendProjectLayoutPage from "../components/app_components/BackendsPage/BackendProjectLayoutPage";
import SingleFrontendsPage from "../components/app_components/FrontendsPage/SingleFrontendsPage";
import FrontendProjectLayoutPage from "../components/app_components/FrontendsPage/FrontendProjectLayoutPage";
import SingleFirebasePage from "../components/app_components/FirebasePage/SingleFirebasePage";
import FirebaseProjectLayoutPage from "../components/app_components/FirebasePage/FirebaseProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>
<Route path="/crm/:singleCrmId" exact element={<SingleCrmPage />} />
<Route path="/crm" exact element={<CrmProjectLayoutPage />} />
<Route path="/opportunity/:singleOpportunityId" exact element={<SingleOpportunityPage />} />
<Route path="/opportunity" exact element={<OpportunityProjectLayoutPage />} />
<Route path="/contract/:singleContractId" exact element={<SingleContractPage />} />
<Route path="/contract" exact element={<ContractProjectLayoutPage />} />
<Route path="/apikey/:singleApikeyId" exact element={<SingleApikeyPage />} />
<Route path="/apikey" exact element={<ApikeyProjectLayoutPage />} />
<Route path="/backends/:singleBackendsId" exact element={<SingleBackendsPage />} />
<Route path="/backends" exact element={<BackendProjectLayoutPage />} />
<Route path="/frontends/:singleFrontendsId" exact element={<SingleFrontendsPage />} />
<Route path="/frontends" exact element={<FrontendProjectLayoutPage />} />
<Route path="/firebase/:singleFirebaseId" exact element={<SingleFirebasePage />} />
<Route path="/firebase" exact element={<FirebaseProjectLayoutPage />} />
                {/* ~cb-add-protected-route~ */}
            </Route>
        </Routes>
    );
}

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);
