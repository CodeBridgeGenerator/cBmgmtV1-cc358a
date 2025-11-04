import React, { useEffect, useState } from "react";
import AppSideBar from "./appSideBar/AppSideBar.js";
import { connect } from "react-redux";
import client from "../../services/restClient.js";
import { classNames } from "primereact/utils";
import { v4 as uuidv4 } from "uuid";

const ProjectSideBarLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;
  const [userRoleName, setUserRoleName] = useState("Unknown Role");
  const [companyType, setCompanyType] = useState(null);

  const getOrSetTabId = () => {
    let tabId = sessionStorage.getItem("browserTabId");
    if (!tabId) {
      tabId = uuidv4();
      sessionStorage.setItem("browserTabId", tabId);
    }
    return tabId;
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // const response = await props.getCache();
        // const currentCache = response.results;

        let tabId = getOrSetTabId();

        // if (currentCache?.selectedUser) {
        let selectedProfileId = localStorage.getItem("selectedUser_" + tabId);
        // Fetch profile data for the selected profile ID
        const profileResponse = await client
          .service("profiles")
          .get(selectedProfileId, {
            query: { $select: ["position", "company"] },
          })
          .catch((err) => {
            console.log(err.message);
            return;
          });

        if (profileResponse?.position) {
          const positionId = profileResponse.position;

          // Fetch position data to get the name
          const positionResponse = await client
            .service("positions")
            .get(positionId, {
              query: { $select: ["name"] },
            });

          if (positionResponse?.name) {
            setUserRoleName(positionResponse.name);
          } else {
            console.warn("Position name not found for the given position ID.");
          }
          // If profile has a company, fetch company data
          if (profileResponse?.company) {
            const companyResponse = await client
              .service("companies")
              .get(profileResponse.company, {
                query: { $select: ["companyType"] },
              });
            
            if (companyResponse?.companyType) {
              setCompanyType(companyResponse.companyType);
            }
          }

        } else {
          console.warn("Position field not found in the profile data.");
        }
      } catch (error) {
        console.error("Error fetching user role data:", error);
      }
    };

    fetchUserRole();
  }, [props.getCache]);

  return props.isLoggedIn ? (
    <div className="flex min-h-[calc(100vh-5rem)] mt-2 bg-white">
      <AppSideBar
        className={classNames("", { hidden: !children })}
        userRole={userRoleName}
        companyType={companyType}
        activeKey={activeKey}
        activeDropdown={activeDropdown}
      />
      <div className="flex-1 " style={{ overflowX: "auto" }}>
        {" "}
        {children}
      </div>
    </div>
  ) : (
    children
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

export default connect(mapState, mapDispatch)(ProjectSideBarLayout);
