import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import VoucherEntries from "./Procurements/VoucherEntries";
import Statements from "./Procurements/Statements";
import SummaryAndManagementSheets from "./Procurements/SummaryAndManagementSheets";
import NavigationButton from "./Components/Procurements/NavigationButton";

function Procurement() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropDown = (id) => {
    return (
      <div
        className="absolute left-0 origin-top-right rounded shadow bg-white"
        style={{ top: "50px" }}
      >
        <div className="text-center py-2 hover:bg-gray-100 mt-2">詳細</div>
        <div className="px-4 py-2 hover:bg-gray-100">編集</div>
        <div className="px-4 py-2 mb-2 hover:bg-gray-100">削除</div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {location.pathname === "/procurement" && (
        <div className="px-40 py-10">
          {/* 仕入伝票 */}
          <div className="pb-6 text-2xl font-bold">仕入伝票</div>
          <div className="">
            <div className="flex flex-wrap gap-4 mb-4">
              <NavigationButton
                label="発注伝票"
                to="/procurement/voucher-entries"
              />
              <NavigationButton 
                label="仕入伝票" 
                to="/procurement/statements" 
              />
              <NavigationButton
                label="入出庫伝票"
                to="/procurement/summary-and-management-sheets"
              />
              <NavigationButton 
                label="棚卸伝票" 
                to="" 
              />
              <NavigationButton 
                label="支払伝票" 
                to="" 
              />
            </div>
          </div>
          {/* 明細表 */}
          <p className="mt-12 pb-6 text-2xl">明細表</p>
          <div className="">
            <div className="flex flex-wrap gap-4 mb-4">
              <NavigationButton 
                label="発注明細表" 
                to="" 
              />
              <NavigationButton 
                label="仕入明細表" 
                to="" 
              />
              <NavigationButton 
                label="入出庫明細表" 
                to="" 
              />
              <NavigationButton 
                label="棚卸明細表" 
                to="" 
              />
              <NavigationButton 
                label="支払明細表" 
                to="" 
              />
            </div>
          </div>
          {/* 集計表 */}
          <p className="mt-12 pb-6 text-2xl">集計表</p>
          <div className="">
            <div className="flex flex-wrap gap-4 mb-4">
              <NavigationButton 
                label="発注集計表" 
                to="" 
              />
              <NavigationButton 
                label="仕入集計表" 
                to="" 
              />
              <NavigationButton 
                label="入出庫集計表" 
                to="" 
              />
              <NavigationButton 
                label="棚卸集計表" 
                to="" 
              />
              <NavigationButton 
                label="支払集計表" 
                to="" 
              />
              <NavigationButton 
                label="買掲金殘高" 
                to="" 
              />
              <NavigationButton 
                label="在庫表" 
                to="" 
              />
              <NavigationButton 
                label="月次在庫表" 
                to="" 
              />
            </div>
          </div>
          {/* 原材料 */}
          <p className="mt-12 pb-6 text-2xl">原材料</p>
          <div className="">
            <div className="flex flex-wrap gap-4 mb-4">
              <NavigationButton 
                label="原材料一覧" 
                to="" 
              />
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="voucher-entries/*" element={<VoucherEntries />} />
        <Route path="statements/*" element={<Statements />} />
        <Route
          path="summary-and-management-sheets/*"
          element={<SummaryAndManagementSheets />}
        />
      </Routes>
    </div>
  );
}

export default Procurement;
