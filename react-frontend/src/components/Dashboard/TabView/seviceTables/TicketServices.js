// import React from "react";
// import { TabView, TabPanel } from "primereact/tabview";
// import { connect } from "react-redux";
// import AtlasTicketsPage from "../../../app_components/AtlasTicketsPage/AtlasTicketsPage";
// import ExternalTicketsPage from "../../../app_components/ExternalTicketsPage/ExternalTicketsPage";
// import IncomingMachineTicketsPage from "../../../app_components/IncomingMachineTicketsPage/IncomingMachineTicketsPage";
// import JobStationTicketsPage from "../../../app_components/JobStationTicketsPage/JobStationTicketsPage";
// import ExternalTicketsRaiseTicketPage from "../../../app_components/ExternalTicketsPage/ExternalTicketsRaiseTicketPage/ExternalTicketsRaiseTicketPage";

// const TicketServices = (props) => {
//   return (
//     <TabView>
//       <TabPanel header="Incoming Tickets">
//         <IncomingMachineTicketsPage />
//       </TabPanel>
//       <TabPanel header="Job Tickets">
//         <JobStationTicketsPage />
//       </TabPanel>
//       <TabPanel header="Atlas Tickets">
//         <AtlasTicketsPage />
//       </TabPanel>

//       <TabPanel header="External Tickets">
//         <ExternalTicketsPage />
//       </TabPanel>

//       <TabPanel header="Raise External Tickets">
//         <ExternalTicketsRaiseTicketPage />
//       </TabPanel>
//     </TabView>
//   );
// };

// const mapState = (state) => {
//   const { user } = state.auth;
//   return { user };
// };
// const mapDispatch = (dispatch) => ({
//   alert: (data) => dispatch.toast.alert(data),
// });

// export default connect(mapState, mapDispatch)(TicketServices);
