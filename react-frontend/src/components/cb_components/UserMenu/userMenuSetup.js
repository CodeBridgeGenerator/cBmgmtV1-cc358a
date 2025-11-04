import React, { useState, useEffect } from "react";
import ProjectLayout from "../../Layouts/ProjectLayout";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import client from "../../../services/restClient";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//icons
import HomeIcon from "../../../assets/icons/Home.js";
import Data from "../../../assets/icons/Data.js";
import Messaging from "../../../assets/icons/Messaging.js";
import Report from "../../../assets/icons/Report.js";
import GenAI from "../../../assets/icons/GenAI.js";
import StaffInfo from "../../../assets/icons/StaffInfo.js";
import Stack from "../../../assets/icons/Stack.js";
import DynaLoader from "../../../assets/icons/DynaLoader.js";
import Server from "../../../assets/icons/Server.js";
import Email from "../../../assets/icons/Email.js";
import MailSent from "../../../assets/icons/MailSent.js";
import Load from "../../../assets/icons/Load.js";
import Chat from "../../../assets/icons/Chat.js";
import Terminal from "../../../assets/icons/Terminal.js";
import Documents from "../../../assets/icons/Documents.js";
import Admin from "../../../assets/icons/Admin.js";
import Users from "../../../assets/icons/Users.js";
import Triangle from "../../../assets/icons/Triangle.js";
import Checklist from "../../../assets/icons/Checklist.js";
import Tickets from "../../../assets/icons/Tickets.js";
import Incoming from "../../../assets/icons/Incoming.js";
import JobStation from "../../../assets/icons/Jobstation.js";
import External from "../../../assets/icons/External.js";
import Raiseexternal from "../../../assets/icons/Raiseexternal.js";
import Building from "../../../assets/icons/Building.js";
import Profile from "../../../assets/icons/Profile.js";
import Profiles from "../../../assets/icons/Profiles.js";
import Employees from "../../../assets/icons/Employees.js";
import UserLogin from "../../../assets/icons/UserLogin.js";
import Superiors from "../../../assets/icons/Superiors.js";
import Roles from "../../../assets/icons/Roles.js";
import Positions from "../../../assets/icons/Positions.js";
import Addresses from "../../../assets/icons/Addresses.js";
import Phones from "../../../assets/icons/Phones.js";
import Companies from "../../../assets/icons/Companies.js";
import Branches from "../../../assets/icons/Branches.js";
import Sections from "../../../assets/icons/Sections.js";
import Permissions from "../../../assets/icons/Permissions.js";
import HeadOfSection from "../../../assets/icons/HeadOfSection.js";
import HeadOfDept from "../../../assets/icons/HeadOfDept.js";
import Department from "../../../assets/icons/Department.js";
import DepartmentAdmin from "../../../assets/icons/DepartmentAdmin.js";
import Files from "../../../assets/icons/Files.js";
import Sales from "../../../assets/icons/Sales.js";
import Stocks from "../../../assets/icons/Stocks.js";
import StockIn from "../../../assets/icons/StockIn.js";
import StockOut from "../../../assets/icons/StockIn.js";
import Logs from "../../../assets/icons/Logs.js";
import People from "../../../assets/icons/People.js";
import Technician from "../../../assets/icons/Master.js";
import Master from "../../../assets/icons/Master.js";
import Tests from "../../../assets/icons/Tests.js";
import Errors from "../../../assets/icons/Errors.js";
import Supervisor from "../../../assets/icons/Supervisor.js";
import { MultiSelect } from "primereact/multiselect";

const Home = (props) => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [error, setError] = useState({});
  const [rolesOptions, setRolesOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [collapsedMenus, setCollapsedMenus] = useState({});
  const [formData, setFormData] = useState({
    roles: [],
    positions: [],
    profiles: [],
    user: null,
    company: null,
    branch: null,
    department: null,
    section: null,
    menuItems: [{ name: "", routePage: "", submenus: [], icon: "" }],
  });
  const [groupBy, setGroupBy] = useState("position");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = process.env.REACT_APP_SERVER_URL + "/listServices";
        const response = await axios.get(apiUrl);
        if (response.data?.status && response.data?.data) {
          const services = response.data.data.map((service) => `/${service}`);
          setServiceOptions(services);
        } else {
          console.error("Failed to fetch service options:", response.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const iconOptions = [
    {
      label: "Home",
      value: "../../../assets/icons/Home.js",
      icon: <HomeIcon />,
    },
    { label: "Data", value: "../../../assets/icons/Data.js", icon: <Data /> },
    {
      label: "Messaging",
      value: "../../../assets/icons/Messaging.js",
      icon: <Messaging />,
    },
    {
      label: "Report",
      value: "../../../assets/icons/Report.js",
      icon: <Report />,
    },
    {
      label: "GenAI",
      value: "../../../assets/icons/GenAI.js",
      icon: <GenAI />,
    },
    {
      label: "StaffInfo",
      value: "../../../assets/icons/StaffInfo.js",
      icon: <StaffInfo />,
    },
    {
      label: "Stack",
      value: "../../../assets/icons/Stack.js",
      icon: <Stack />,
    },
    {
      label: "DynaLoader",
      value: "../../../assets/icons/DynaLoader.js",
      icon: <DynaLoader />,
    },
    {
      label: "Server",
      value: "../../../assets/icons/Server.js",
      icon: <Server />,
    },
    {
      label: "Email",
      value: "../../../assets/icons/Email.js",
      icon: <Email />,
    },
    {
      label: "MailSent",
      value: "../../../assets/icons/MailSent.js",
      icon: <MailSent />,
    },
    { label: "Load", value: "../../../assets/icons/Load.js", icon: <Load /> },
    { label: "Chat", value: "../../../assets/icons/Chat.js", icon: <Chat /> },
    {
      label: "Terminal",
      value: "../../../assets/icons/Terminal.js",
      icon: <Terminal />,
    },
    {
      label: "Documents",
      value: "../../../assets/icons/Documents.js",
      icon: <Documents />,
    },
    {
      label: "Admin",
      value: "../../../assets/icons/Admin.js",
      icon: <Admin />,
    },
    {
      label: "Users",
      value: "../../../assets/icons/Users.js",
      icon: <Users />,
    },
    {
      label: "Triangle",
      value: "../../../assets/icons/Triangle.js",
      icon: <Triangle />,
    },
    {
      label: "Checklist",
      value: "../../../assets/icons/Checklist.js",
      icon: <Checklist />,
    },
    {
      label: "Tickets",
      value: "../../../assets/icons/Tickets.js",
      icon: <Tickets />,
    },
    {
      label: "Incoming",
      value: "../../../assets/icons/Incoming.js",
      icon: <Incoming />,
    },
    {
      label: "JobStation",
      value: "../../../assets/icons/Jobstation.js",
      icon: <JobStation />,
    },
    {
      label: "External",
      value: "../../../assets/icons/External.js",
      icon: <External />,
    },
    {
      label: "Raiseexternal",
      value: "../../../assets/icons/Raiseexternal.js",
      icon: <Raiseexternal />,
    },
    {
      label: "Building",
      value: "../../../assets/icons/Building.js",
      icon: <Building />,
    },
    {
      label: "Profile",
      value: "../../../assets/icons/Profile.js",
      icon: <Profile />,
    },
    {
      label: "Profiles",
      value: "../../../assets/icons/Profiles.js",
      icon: <Profiles />,
    },
    {
      label: "Employees",
      value: "../../../assets/icons/Employees.js",
      icon: <Employees />,
    },
    {
      label: "UserLogin",
      value: "../../../assets/icons/UserLogin.js",
      icon: <UserLogin />,
    },
    {
      label: "Superiors",
      value: "../../../assets/icons/Superiors.js",
      icon: <Superiors />,
    },
    {
      label: "Roles",
      value: "../../../assets/icons/Roles.js",
      icon: <Roles />,
    },
    {
      label: "Positions",
      value: "../../../assets/icons/Positions.js",
      icon: <Positions />,
    },
    {
      label: "Addresses",
      value: "../../../assets/icons/Addresses.js",
      icon: <Addresses />,
    },
    {
      label: "Phones",
      value: "../../../assets/icons/Phones.js",
      icon: <Phones />,
    },
    {
      label: "Companies",
      value: "../../../assets/icons/Companies.js",
      icon: <Companies />,
    },
    {
      label: "Branches",
      value: "../../../assets/icons/Branches.js",
      icon: <Branches />,
    },
    {
      label: "Sections",
      value: "../../../assets/icons/Sections.js",
      icon: <Sections />,
    },
    {
      label: "Permissions",
      value: "../../../assets/icons/Permissions.js",
      icon: <Permissions />,
    },
    {
      label: "HeadOfSection",
      value: "../../../assets/icons/HeadOfSection.js",
      icon: <HeadOfSection />,
    },
    {
      label: "HeadOfDept",
      value: "../../../assets/icons/HeadOfDept.js",
      icon: <HeadOfDept />,
    },
    {
      label: "Department",
      value: "../../../assets/icons/Department.js",
      icon: <Department />,
    },
    {
      label: "DepartmentAdmin",
      value: "../../../assets/icons/DepartmentAdmin.js",
      icon: <DepartmentAdmin />,
    },
    {
      label: "Files",
      value: "../../../assets/icons/Files.js",
      icon: <Files />,
    },
    {
      label: "Sales",
      value: "../../../assets/icons/Sales.js",
      icon: <Sales />,
    },
    {
      label: "Stocks",
      value: "../../../assets/icons/Stocks.js",
      icon: <Stocks />,
    },
    {
      label: "StockIn",
      value: "../../../assets/icons/StockIn.js",
      icon: <StockIn />,
    },
    {
      label: "StockOut",
      value: "../../../assets/icons/StockOut.js",
      icon: <StockOut />,
    },
    { label: "Logs", value: "../../../assets/icons/Logs.js", icon: <Logs /> },
    {
      label: "People",
      value: "../../../assets/icons/People.js",
      icon: <People />,
    },
    {
      label: "Technician",
      value: "../../../assets/icons/Technician.js",
      icon: <Technician />,
    },
    {
      label: "Master",
      value: "../../../assets/icons/Master.js",
      icon: <Master />,
    },
    {
      label: "Tests",
      value: "../../../assets/icons/Tests.js",
      icon: <Tests />,
    },
    {
      label: "Errors",
      value: "../../../assets/icons/Errors.js",
      icon: <Errors />,
    },
    {
      label: "Supervisor",
      value: "../../../assets/icons/Supervisor.js",
      icon: <Supervisor />,
    },
  ];

  const handleAddMenu = () => {
    setFormData((prev) => ({
      ...prev,
      menuItems: [
        ...prev.menuItems,
        { name: "", routePage: "", submenus: [], icon: "" },
      ],
    }));
  };

  const handleMenuChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMenuItems = [...prev.menuItems];
      updatedMenuItems[index] = { ...updatedMenuItems[index], [field]: value };
      return { ...prev, menuItems: updatedMenuItems };
    });
  };

  const handleAddSubmenu = (menuIndex) => {
    setFormData((prev) => {
      const updatedMenuItems = [...prev.menuItems];
      const currentSubmenus = updatedMenuItems[menuIndex].submenus || [];
      updatedMenuItems[menuIndex] = {
        ...updatedMenuItems[menuIndex],
        submenus: [...currentSubmenus, { name: "", routePage: "", icon: "" }],
      };
      return { ...prev, menuItems: updatedMenuItems };
    });
  };

  const handleSubmenuChange = (menuIndex, submenuIndex, field, value) => {
    setFormData((prev) => {
      const updatedMenuItems = [...prev.menuItems];
      updatedMenuItems[menuIndex].submenus[submenuIndex] = {
        ...updatedMenuItems[menuIndex].submenus[submenuIndex],
        [field]: value,
      };
      return { ...prev, menuItems: updatedMenuItems };
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData };

      const profileRelatedPositionIds = [
        ...new Set(
          dataToSave.profiles
            .map(
              (profileId) =>
                profileOptions.find((p) => p.value === profileId)?.position,
            )
            .filter(Boolean),
        ),
      ];

      const profileRelatedRoleIds = [
        ...new Set(
          profileRelatedPositionIds
            .map(
              (positionId) =>
                positionOptions.find((p) => p.value === positionId)?.roleId,
            )
            .filter(Boolean),
        ),
      ];

      const positionRelatedRoleIds = [
        ...new Set(
          dataToSave.positions
            .map(
              (positionId) =>
                positionOptions.find((p) => p.value === positionId)?.roleId,
            )
            .filter(Boolean),
        ),
      ];

      if (dataToSave.profiles.length > 0) {
        dataToSave.positions = dataToSave.positions.filter(
          (positionId) => !profileRelatedPositionIds.includes(positionId),
        );

        dataToSave.roles = dataToSave.roles.filter(
          (roleId) =>
            !profileRelatedRoleIds.includes(roleId) &&
            !positionRelatedRoleIds.includes(roleId),
        );
      } else if (dataToSave.positions.length > 0) {
        dataToSave.roles = dataToSave.roles.filter(
          (roleId) => !positionRelatedRoleIds.includes(roleId),
        );
      }

      const filteredFormData = Object.keys(dataToSave).reduce((acc, key) => {
        if (dataToSave[key] !== null && dataToSave[key] !== undefined) {
          acc[key] = dataToSave[key];
        }
        return acc;
      }, {});

      if (filteredFormData.menuItems) {
        filteredFormData.menuItems = filteredFormData.menuItems
          .map((menuItem) => {
            const filteredMenuItem = { ...menuItem };
            if (filteredMenuItem.submenus) {
              filteredMenuItem.submenus = filteredMenuItem.submenus.filter(
                (submenu) =>
                  submenu.name !== null &&
                  submenu.routePage !== null &&
                  submenu.icon !== null,
              );
            }
            return filteredMenuItem;
          })
          .filter(
            (menuItem) =>
              menuItem.name !== null &&
              menuItem.routePage !== null &&
              menuItem.icon !== null,
          );
      }

      console.log("Data to save:", filteredFormData); // Debugging

      await client.service("profileMenu").create(filteredFormData);
      console.log("Saved form data:", filteredFormData);
      props.alert({
        type: "success",
        title: "User Context and Menu Items",
        message: "Data saved successfully!",
      });
      navigate("/profileMenu");
    } catch (err) {
      console.error("Error saving data:", err);
      setError({ saveData: "Failed to save data." });
      props.alert({
        type: "error",
        title: "Save Error",
        message: err.message || "Failed to save data.",
      });
    }
  };

  useEffect(() => {
    const fetchRolesOptions = async () => {
      try {
        const response = await client
          .service("roles")
          .find({ query: { $limit: 10000 } });
        setRolesOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching Roles options:`, error);
      }
    };

    const fetchPositionOptions = async () => {
      try {
        const response = await client
          .service("positions")
          .find({ query: { $limit: 10000 } });
        setPositionOptions(
          response.data.map((item) => ({
            label: item.name,
            value: item._id,
            roleId: item.roleId,
          })),
        );
      } catch (error) {
        console.error(`Error fetching Position options:`, error);
      }
    };

    const fetchProfileOptions = async () => {
      try {
        const response = await client
          .service("profiles")
          .find({ query: { $limit: 10000 } });
        setProfileOptions(
          response.data.map((item) => ({
            label: item.name,
            value: item._id,
            position: item.position,
          })),
        );
      } catch (error) {
        console.error(`Error fetching Profile options:`, error);
      }
    };

    const fetchUserOptions = async () => {
      try {
        const response = await client
          .service("users")
          .find({ query: { $limit: 10000 } });
        setUserOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching User options:`, error);
        props.alert({
          title: "User",
          type: "error",
          message: error.message || `Failed to fetch User options`,
        });
      }
    };

    const fetchCompanyOptions = async () => {
      try {
        const response = await client
          .service("companies")
          .find({ query: { $limit: 10000 } });
        setCompanyOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching Company options:`, error);
        props.alert({
          title: "Company",
          type: "error",
          message: error.message || `Failed to fetch Company options`,
        });
      }
    };

    const fetchBranchOptions = async () => {
      try {
        const response = await client
          .service("branches")
          .find({ query: { $limit: 10000 } });
        setBranchOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching Branch options:`, error);
        props.alert({
          title: "Branch",
          type: "error",
          message: error.message || `Failed to fetch Branch options`,
        });
      }
    };

    const fetchDepartmentOptions = async () => {
      try {
        const response = await client
          .service("departments")
          .find({ query: { $limit: 10000 } });
        setDepartmentOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching Department options:`, error);
        props.alert({
          title: "Department",
          type: "error",
          message: error.message || `Failed to fetch Department options`,
        });
      }
    };

    const fetchSectionOptions = async () => {
      try {
        const response = await client
          .service("sections")
          .find({ query: { $limit: 10000 } });
        setSectionOptions(
          response.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error(`Error fetching Section options:`, error);
        props.alert({
          title: "Section",
          type: "error",
          message: error.message || `Failed to fetch Section options`,
        });
      }
    };

    fetchRolesOptions();
    fetchPositionOptions();
    fetchProfileOptions();
    fetchUserOptions();
    fetchCompanyOptions();
    fetchBranchOptions();
    fetchDepartmentOptions();
    fetchSectionOptions();
  }, []);

  useEffect(() => {
    if (formData.roles.length > 0) {
      const filtered = positionOptions.filter((position) =>
        formData.roles.includes(position.roleId),
      );
      setFilteredPositions(filtered);
    } else {
      setFilteredPositions([]);
    }
  }, [formData.roles, positionOptions]);

  useEffect(() => {
    if (formData.positions.length > 0) {
      const filtered = profileOptions.filter((profile) =>
        formData.positions.includes(profile.position),
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles([]);
    }
  }, [formData.positions, profileOptions]);

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      roles: e.value,
      positions: [],
      profiles: [],
    }));
  };

  const handlePositionChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      positions: e.value,
      profiles: [],
    }));
  };

  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profiles: e.value,
    }));
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDeleteMenu = (index) => {
    setFormData((prev) => {
      const updatedMenuItems = prev.menuItems.filter((_, i) => i !== index);
      return { ...prev, menuItems: updatedMenuItems };
    });
  };

  const handleDeleteSubmenu = (menuIndex, submenuIndex) => {
    setFormData((prev) => {
      const updatedMenuItems = [...prev.menuItems];
      updatedMenuItems[menuIndex].submenus = updatedMenuItems[
        menuIndex
      ].submenus.filter((_, i) => i !== submenuIndex);
      return { ...prev, menuItems: updatedMenuItems };
    });
  };

  const toggleCollapse = (index) => {
    setCollapsedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ProjectLayout>
      <div className="flex min-h-[calc(100vh-5rem)] bg-white">
        <div className="flex-1 ml-2">
          {/* Steps */}
          <ul className="list-none p-0 m-0 flex flex-column md:flex-row mt-6">
            {["User Context", "Menu Items", "Preview"].map((step, index) => (
              <li
                key={index}
                className={`relative mr-0 md:mr-8 flex-auto cursor-pointer ${
                  activeStep === index + 1 ? "active" : ""
                }`}
                onClick={() => handleStepClick(index + 1)}
              >
                {/* Step Indicator */}
                <div
                  className={`border-round p-3 surface-card flex flex-column md:flex-row align-items-center z-1 ${
                    activeStep === index + 1
                      ? "border-2 border-blue-500"
                      : "border-1 border-300"
                  }`}
                >
                  <i
                    className={`pi ${
                      activeStep > index + 1
                        ? "pi-check-circle text-green-500"
                        : activeStep === index + 1
                          ? "pi-credit-card text-blue-600"
                          : "pi-circle-fill text-600"
                    } text-2xl md:text-4xl mb-2 md:mb-0 mr-0 md:mr-3`}
                  ></i>
                  <div>
                    <div
                      className={`font-medium mb-1 ${
                        activeStep === index + 1 ? "text-blue-600" : "text-900"
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                </div>
                {/* Line between steps */}
                {index < 2 && (
                  <div
                    className={`w-full absolute top-50 left-100 hidden md:block ${
                      activeStep > index + 1 ? "bg-blue-500" : "surface-300"
                    }`}
                    style={{ transform: "translateY(-50%)", height: "2px" }}
                  ></div>
                )}
              </li>
            ))}
          </ul>

          {/* Content for each step */}
          <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
            {activeStep === 1 && (
              <div>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  User Context
                </h2>
                {/* User Context Form */}
                <div className="p-fluid grid">
                  {/* Basic Fields */}
                  <div className="field col-12 md:col-6">
                    <label htmlFor="role">Select Role</label>
                    <MultiSelect
                      id="role"
                      value={formData.roles}
                      options={rolesOptions}
                      onChange={handleRoleChange}
                      placeholder="Select Roles"
                      optionLabel="label"
                      optionValue="value"
                      display="chip"
                    />
                  </div>

                  <div className="field col-12 md:col-6">
                    <label htmlFor="position">Select Position</label>
                    <MultiSelect
                      id="position"
                      value={formData.positions}
                      options={rolesOptions
                        .filter((role) => formData.roles.includes(role.value)) // Filter roles to only include selected ones
                        .map((role) => ({
                          label: role.label,
                          value: role.value,
                          items: filteredPositions
                            .filter(
                              (position) => position.roleId === role.value,
                            )
                            .map((position) => ({
                              label: position.label,
                              value: position.value,
                            })),
                        }))}
                      onChange={handlePositionChange}
                      placeholder="Select Positions"
                      optionLabel="label"
                      optionValue="value"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      display="chip"
                      filter
                      disabled={formData.roles.length === 0}
                    />
                  </div>

                  <div className="field col-12 md:col-6">
                    <label htmlFor="profile">Select Profile</label>
                    <div className="p-inputgroup">
                      <MultiSelect
                        id="profile"
                        value={formData.profiles}
                        options={filteredPositions
                          .filter((position) =>
                            formData.positions.includes(position.value),
                          )
                          .map((position) => ({
                            label: position.label,
                            value: position.value,
                            items: filteredProfiles
                              .filter(
                                (profile) =>
                                  profile.position === position.value,
                              )
                              .map((profile) => ({
                                label: profile.label,
                                value: profile.value,
                              })),
                          }))}
                        onChange={handleProfileChange}
                        placeholder="Select Profiles"
                        optionLabel="label"
                        optionValue="value"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        display="chip"
                        filter
                        disabled={formData.positions.length === 0}
                      />
                    </div>
                  </div>
                  {/* <div className="field col-12 md:col-4">
                                  <label htmlFor="user">User</label>
                                  <Dropdown
                                      id="user"
                                      value={profileMenuData.user}
                                      options={userOptions}
                                       onChange={(e) => handleInputChange(1, "user", e.value)} // Use generic handler, step is no longer needed
                                      placeholder="Select a User"
                                  />
                              </div> */}

                  {/* Advanced Options */}
                  <div className="col-12">
                    <div className="flex align-items-center">
                      <h5 className="m-0">Advanced Options</h5>
                      <Button
                        icon={showAdvanced ? "pi pi-minus" : "pi pi-plus"}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="ml-2 p-button-text"
                      />
                    </div>
                    {showAdvanced && (
                      <div className="p-fluid grid">
                        <div className="field col-12 md:col-4">
                          <label htmlFor="company">Company</label>
                          <Dropdown
                            id="company"
                            value={formData.company}
                            options={companyOptions}
                            onChange={(e) =>
                              handleInputChange("company", e.value)
                            }
                            placeholder="Select a Company"
                          />
                        </div>
                        <div className="field col-12 md:col-4">
                          <label htmlFor="branch">Branch</label>
                          <Dropdown
                            id="branch"
                            value={formData.branch}
                            options={branchOptions}
                            onChange={(e) =>
                              handleInputChange("branch", e.value)
                            }
                            placeholder="Select a Branch"
                          />
                        </div>
                        <div className="field col-12 md:col-4">
                          <label htmlFor="department">Department</label>
                          <Dropdown
                            id="department"
                            value={formData.department}
                            options={departmentOptions}
                            onChange={(e) =>
                              handleInputChange("department", e.value)
                            }
                            placeholder="Select a Department"
                          />
                        </div>
                        <div className="field col-12 md:col-4">
                          <label htmlFor="section">Section</label>
                          <Dropdown
                            id="section"
                            value={formData.section}
                            options={sectionOptions}
                            onChange={(e) =>
                              handleInputChange("section", e.value)
                            }
                            placeholder="Select a Section"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Error message*/}
                {error.saveData && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {error.saveData}
                  </p>
                )}
                <div
                  className="mt-4 mr-40"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button label="Next" onClick={handleNext} />
                </div>
              </div>
            )}
            {activeStep === 2 && (
              <div>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  Menu Items
                </h2>

                {/* Menu Items Form */}
                <div>
                  {formData.menuItems.map((menu, menuIndex) => (
                    <div key={menuIndex} className="menu-item-container">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className="p-fluid grid flex-grow-1">
                          <div className="field col-12 md:col-4">
                            <label htmlFor={`menuName-${menuIndex}`}>
                              Menu Name
                            </label>
                            <InputText
                              id={`menuName-${menuIndex}`}
                              value={menu.name}
                              onChange={(e) =>
                                handleMenuChange(
                                  menuIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="field col-12 md:col-4">
                            <label htmlFor={`menuRoutePage-${menuIndex}`}>
                              Route Page
                            </label>
                            <Dropdown
                              id={`menuRoutePage-${menuIndex}`}
                              value={menu.routePage}
                              options={serviceOptions}
                              onChange={(e) =>
                                handleMenuChange(
                                  menuIndex,
                                  "routePage",
                                  e.value,
                                )
                              }
                              placeholder="Select a Route Page"
                            />
                          </div>
                          <div className="field col-12 md:col-3">
                            <label htmlFor={`menuIcon-${menuIndex}`}>
                              Icon
                            </label>
                            <Dropdown
                              id={`menuIcon-${menuIndex}`}
                              value={menu.icon}
                              options={iconOptions}
                              optionLabel="label"
                              optionValue="value"
                              onChange={(e) =>
                                handleMenuChange(menuIndex, "icon", e.value)
                              }
                              placeholder="Select an Icon"
                              itemTemplate={(option) => (
                                <div className="flex align-items-center">
                                  {option.icon}
                                  <span className="ml-2">{option.label}</span>
                                </div>
                              )}
                            />
                          </div>
                          <div
                            className="col-12 md:col-1"
                            style={{ display: "flex", alignItems: "flex-end" }}
                          >
                            {formData.menuItems.length > 1 && (
                              <Button
                                icon="pi pi-trash"
                                // icon="pi pi-plus"
                                className="p-button-text ml-2"
                                tooltip="Delete Menu"
                                // className="p-button-danger p-button-sm"
                                onClick={() => handleDeleteMenu(menuIndex)}
                                tooltipOptions={{ position: "bottom" }}
                                style={{ marginBottom: "10px" }}
                              />
                            )}
                            {formData.menuItems.length - 1 === menuIndex && (
                              <Button
                                icon="pi pi-plus"
                                onClick={handleAddMenu}
                                style={{ marginBottom: "10px" }}
                                className="p-button-text ml-2"
                                tooltip="Add Menu"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submenus */}
                      {menu.submenus.map((submenu, submenuIndex) => (
                        <div
                          key={submenuIndex}
                          className="submenu-item-container ml-6"
                        >
                          <div className="flex flex-wrap gap-2">
                            <div className="p-fluid grid flex-grow-1">
                              <div className="field col-12 md:col-4">
                                <label htmlFor={`submenuName-${submenuIndex}`}>
                                  Submenu Name
                                </label>
                                <InputText
                                  id={`submenuName-${submenuIndex}`}
                                  value={submenu.name}
                                  onChange={(e) =>
                                    handleSubmenuChange(
                                      menuIndex,
                                      submenuIndex,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="field col-12 md:col-4">
                                <label
                                  htmlFor={`submenuRoutePage-${submenuIndex}`}
                                >
                                  Route Page
                                </label>
                                <Dropdown
                                  id={`submenuRoutePage-${submenuIndex}`}
                                  value={submenu.routePage}
                                  options={serviceOptions}
                                  onChange={(e) =>
                                    handleSubmenuChange(
                                      menuIndex,
                                      submenuIndex,
                                      "routePage",
                                      e.value,
                                    )
                                  }
                                  placeholder="Select a Route Page"
                                />
                              </div>
                              <div className="field col-12 md:col-3">
                                <label htmlFor={`submenuIcon-${submenuIndex}`}>
                                  Icon
                                </label>
                                <Dropdown
                                  id={`submenuIcon-${submenuIndex}`}
                                  value={submenu.icon}
                                  options={iconOptions}
                                  optionLabel="label"
                                  optionValue="value"
                                  onChange={(e) =>
                                    handleSubmenuChange(
                                      menuIndex,
                                      submenuIndex,
                                      "icon",
                                      e.value,
                                    )
                                  }
                                  placeholder="Select an Icon"
                                  itemTemplate={(option) => (
                                    <div className="flex align-items-center">
                                      {option.icon}
                                      <span className="ml-2">
                                        {option.label}
                                      </span>
                                    </div>
                                  )}
                                />
                              </div>
                              <div
                                className="col-1 md:col-1"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-text ml-2"
                                  onClick={() =>
                                    handleDeleteSubmenu(menuIndex, submenuIndex)
                                  }
                                  tooltip="Delete Submenu"
                                  tooltipOptions={{ position: "bottom" }}
                                  style={{ marginBottom: "10px" }}
                                />
                                {menu.submenus.length - 1 === submenuIndex && (
                                  <Button
                                    icon="pi pi-plus"
                                    onClick={() => handleAddSubmenu(menuIndex)}
                                    style={{ marginBottom: "10px" }}
                                    className="p-button-text ml-2"
                                    tooltip="Add Submenu"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Add Submenu Button - Conditionally Rendered */}
                      {menu.submenus.length === 0 && (
                        <Button
                          icon="pi pi-plus"
                          onClick={() => handleAddSubmenu(menuIndex)}
                          className="p-button-text ml-2 mb-5"
                          tooltip="Add Submenu"
                          // label="Add Submenu"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Error message */}
                {error.saveData && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {error.saveData}
                  </p>
                )}
                <div
                  className="mt-4 mr-40"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {activeStep === 2 && (
                    <Button
                      label="Back"
                      onClick={handleBack}
                      className="p-button-secondary mr-2"
                    />
                  )}
                  {activeStep === 2 && (
                    <Button label="Next" onClick={handleNext} />
                  )}
                </div>
              </div>
            )}
            {activeStep === 3 && (
              <div>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  Preview
                </h2>
                <div className="surface-card p-4">
                  <div className="grid">
                    {/* Show Roles only if selected */}
                    {formData.roles.length > 0 && (
                      <div className="col-12 md:col-6 lg:col-6">
                        <div className="flex align-items-center mb-2">
                          <span className="font-bold mr-2">Roles:</span>
                          <span className="text-gray-700">
                            {formData.roles
                              .map(
                                (roleId) =>
                                  rolesOptions.find((r) => r.value === roleId)
                                    ?.label || "Unknown",
                              )
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Show Positions only if selected */}
                    {formData.positions.length > 0 && (
                      <div className="col-12 md:col-6 lg:col-6">
                        <div className="flex align-items-center mb-2">
                          <span className="font-bold mr-2">Positions:</span>
                          <span className="text-gray-700">
                            {formData.positions
                              .map(
                                (positionId) =>
                                  positionOptions.find(
                                    (p) => p.value === positionId,
                                  )?.label || "Unknown",
                              )
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Show Profiles only if selected */}
                    {formData.profiles.length > 0 && (
                      <div className="col-12 md:col-12 lg:col-12">
                        <div className="flex align-items-center mb-2">
                          <span className="font-bold mr-2">Profiles:</span>
                          <span className="text-gray-700">
                            {formData.profiles
                              .map(
                                (profileId) =>
                                  profileOptions.find(
                                    (p) => p.value === profileId,
                                  )?.label || "Unknown",
                              )
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Show other fields only if they have values */}
                    {Object.entries(formData)
                      .filter(
                        ([key, value]) =>
                          ![
                            "roles",
                            "positions",
                            "profiles",
                            "menuItems",
                          ].includes(key) &&
                          value !== null &&
                          value !== undefined &&
                          value !== "" &&
                          !(Array.isArray(value) && value.length === 0),
                      )
                      .map(([key, value]) => {
                        let displayValue = value;

                        // Handle field-specific label lookups
                        switch (key) {
                          case "user":
                            displayValue = userOptions.find(
                              (option) => option.value === value,
                            )?.label;
                            break;
                          case "company":
                            displayValue = companyOptions.find(
                              (option) => option.value === value,
                            )?.label;
                            break;
                          case "branch":
                            displayValue = branchOptions.find(
                              (option) => option.value === value,
                            )?.label;
                            break;
                          case "department":
                            displayValue = departmentOptions.find(
                              (option) => option.value === value,
                            )?.label;
                            break;
                          case "section":
                            displayValue = sectionOptions.find(
                              (option) => option.value === value,
                            )?.label;
                            break;
                        }

                        return (
                          <div key={key} className="col-12 md:col-6 lg:col-4">
                            <div className="flex align-items-center mb-2">
                              <span className="font-bold mr-2">{key}:</span>
                              <span className="text-gray-700">
                                {displayValue || "Not selected"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <h3>Menu Items</h3>
                <div className="surface-card p-4">
                  <ul className="m-0 p-0 list-none">
                    {formData.menuItems.map((menu, menuIndex) => (
                      <li key={menuIndex} className="mb-4">
                        {" "}
                        {/* Increased bottom margin */}
                        <div className="flex align-items-center">
                          {menu.icon &&
                            (() => {
                              const SelectedIcon = iconOptions.find(
                                (icon) => icon.value === menu.icon,
                              )?.icon;
                              return SelectedIcon ? (
                                <span className="mr-2">{SelectedIcon}</span>
                              ) : null;
                            })()}
                          <div className="font-bold text-xl">{menu.name}</div>
                        </div>
                        <div className="text-gray-600">
                          Route: {menu.routePage}
                        </div>
                        {/* Submenus */}
                        {menu.submenus.length > 0 && (
                          <ul className="m-0 p-0 ml-6 list-none">
                            {" "}
                            {/* Increased left margin */}
                            {menu.submenus.map((submenu, submenuIndex) => (
                              <li
                                key={submenuIndex}
                                className="mb-2 pl-4"
                                style={{ borderLeft: "2px solid #ddd" }}
                              >
                                <div className="flex align-items-center">
                                  {submenu.icon &&
                                    (() => {
                                      const SelectedSubIcon = iconOptions.find(
                                        (icon) => icon.value === submenu.icon,
                                      )?.icon;
                                      return SelectedSubIcon ? (
                                        <span className="mr-2">
                                          {SelectedSubIcon}
                                        </span>
                                      ) : null;
                                    })()}
                                  <div className="text-lg">{submenu.name}</div>
                                </div>
                                <div className="text-gray-600">
                                  Route: {submenu.routePage}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div
            className="mt-4 mr-60"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {activeStep === 3 && (
              <Button
                label="Back"
                onClick={handleBack}
                className="p-button-secondary mr-2"
              />
            )}
            {activeStep === 3 && <Button label="Save" onClick={handleSave} />}
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(Home);
