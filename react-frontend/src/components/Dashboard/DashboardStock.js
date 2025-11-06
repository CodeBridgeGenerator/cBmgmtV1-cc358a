import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import RecentComp from "./RecentFavDashComp/RecentComp";
import PinnedItems from "./RecentFavDashComp/FavComponent";
import TotalComponent from "./RecentFavDashComp/TotalComponent";
import LineChart from "./Charts/LineChart/StockLineChart";
import CompanyBarChart from "./Charts/BarChart/StockBarChart";
import StockServices from "./TabView/seviceTables/StockServices";
import ChartPopup from "./PopUpComp/ChartPopup";
import ProjectLayout from "../Layouts/ProjectLayout";
import client from "../../services/restClient";
import { classNames } from "primereact/utils";
import Report from "../../assets/icons/Report";
import StockSummary from "./StockSummary";
import StockUtilizationRate from "./StockUtilizationRate";
import LowStockItems from "./LowStockItems";
import StockLevelsByCategory from "./StockLevelsByCategory";
import FastMovingSlowMovingItems from "./FastMovingSlowMovingItems";
import TopUsedSpareParts from "./TopUsedSpareParts";
import ReorderAlerts from "./ReorderAlerts";

export const AdminControl = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [pinnedItems, setPinnedItems] = useState([]);

  useEffect(() => {
    const fetchCache = async () => {
      try {
        const response = await props.get();
        const { profiles = [], selectedUser } = response.results || {};

        const selectedProfile = profiles.find(
          (profile) => profile.profileId === selectedUser,
        );

        if (selectedProfile?.preferences) {
          const { recent = [], favourites = [] } = selectedProfile.preferences;

          const uniqueRecentItems = recent
            .reverse()
            .filter(
              (item, index, self) =>
                self.findIndex((i) => i.url === item.url) === index &&
                item.mainMenu === "stocks",
            )
            .slice(0, 3)
            .map((item) => ({
              text: item.label,
              subtext: item.name,
              src: item.icon,
              url: item.url,
            }));

          setRecentItems(uniqueRecentItems);

          const filteredPinnedItems = favourites
            .filter((item) => item.mainMenu === "stocks")
            .slice(-3)
            .map((item) => ({
              text: item.label,
              subtext: item.mainMenu,
              src: item.icon,
              url: item.url,
            }));

          setPinnedItems(filteredPinnedItems);
        }
      } catch (error) {
        console.error("Failed to fetch cache:", error);
      }
    };

    fetchCache();
  }, [props.get]);

  useEffect(() => {
    const fetchTotalCompanies = async () => {
      try {
        const { total } = await client.service("sampleDetails").find({
          query: {
            $limit: 0,
          },
        });

        setTotalCompanies(total);
      } catch (error) {
        console.error("Failed to fetch sampleDetails:", error);
        props.alert({
          title: "Sample Details",
          type: "error",
          message: error.message || "Failed to get sampleDetails",
        });
      }
    };

    fetchTotalCompanies();
  }, []);

  return (
    <ProjectLayout>
      <div className="p-2 md:p-4">
        {/* Title and Edit section */}
        <div className="mb-2 flex justify-content-between align-items-center">
          <div className="mb-4 flex justify-content-between align-items-center">
            <span className="text-900 font-medium text-3xl m-0.5">
              Inventory Management {showDash ? " Dashboard" : ""}
            </span>
          </div>
          <div className="mb-4 flex justify-content-between align-items-center">
            <span className="text-900 font-medium text-3xl m-0.5">
              {!showDash ? (
                <Report onClick={() => setShowDash(!showDash)}></Report>
              ) : (
                <i
                  className="pi pi-angle-up"
                  onClick={() => setShowDash(!showDash)}
                >
                  {" "}
                </i>
              )}
            </span>
          </div>
        </div>

        <div
          className={classNames("surface-border border-round surface-card", {
            hidden: !showDash,
          })}
        >
          <div className="grid">
            {/* Recent Component */}
            <div className="col-12 md:col-4 mb-3">
              <RecentComp
                title={"Recent"}
                isEdit={isEdit}
                recentItems={recentItems}
              />
            </div>

            {/* Pinned Items Component */}
            <div className="col-12 md:col-4 mb-3">
              <PinnedItems
                Pinned={"Favourites"}
                isEdit={isEdit}
                pinnedItems={pinnedItems}
              />
            </div>

            {/* Total Component */}
            <div className="col-12 md:col-4">
              <TotalComponent
                TotalComp={"Total Samples"}
                isEdit={isEdit}
                total={totalCompanies}
              />
            </div>
          </div>
        </div>

        {/* Charts Section with integrated ChartPopup */}
        <div className={classNames("", { hidden: !showDash })}>
          <div className="mb-3">
            <ChartPopup isEdit={isEdit} setIsEdit={setIsEdit} />
          </div>
          {showCard && <PopupCard />}
          <div className="grid">
            {/* First Row: Stock Summary and Stock Utilization Rate */}
            <div className="col-12 md:col-6 mb-3">
              <StockSummary />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <StockUtilizationRate />
            </div>

            {/* Second Row: Stock Levels by Category and Low Stock Items, Fast-Moving vs Slow-Moving Items, Top Used Spare Parts */}
            <div className="col-12 md:col-6 mb-3">
              <StockLevelsByCategory />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <div className="grid">
                <div className="col-12 mb-3">
                  <LowStockItems />
                </div>
                <div className="col-12 mb-3">
                  <FastMovingSlowMovingItems />
                </div>
                <div className="col-12 mb-3">
                  <TopUsedSpareParts />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div>
          <StockServices />
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { cache } = state.cache;
  return { user, isLoggedIn, cache };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  get: () => dispatch.cache.get(),
});

export default connect(mapState, mapDispatch)(AdminControl);
