import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProjectsPage from '../components/atlas_components/ProjectsPage';

const MongoDBRouter = (props) => {
    return (
        <Routes>
            <Route path="/groups" exact element={<ProjectsPage />} />
        </Routes>
    );
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
  };
  const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
  });
  
  export default connect(mapState, mapDispatch)(MongoDBRouter);