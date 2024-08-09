// import React from 'react';
// // import { render } from 'react-dom';
// import { useState } from 'react';

// //importing AG Grid dependencies
// import 'ag-grid-enterprise';
// import { LicenseManager } from 'ag-grid-enterprise';
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { AgGridReact } from 'ag-grid-react';

// //please asign your license key to the licenseKey constant as a string below
// const licenseKey =
//   'CompanyName=Equinix Asia Pacific pte ltd,LicensedGroup=equinixMendixPrivateLib,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-027567,SupportServicesEnd=18_June_2023_[v2]_MTY4NzA0MjgwMDAwMA==4be2c388f9a8a7443c72842dff53d5b2';
// LicenseManager.setLicenseKey(licenseKey);
// //please asign your license key to the licenseKey constant as a string above

// const App = () => {
//   const [gridApi, setGridApi] = useState(null);
//   const [gridColumnApi, setGridColumnApi] = useState(null);
//   const [rowData, setRowData] = useState([
//     { make: 'Toyota', model: 'Celica', price: 35000 },
//     { make: 'Toyota', model: 'Celica', price: 35000 },
//     { make: 'Toyota', model: 'Celica', price: 35000 },
//     { make: 'Ford', model: 'Mondeo', price: 32000 },
//     { make: 'Porsche', model: 'Boxter', price: 72000 },
//   ]);

//   const onGridReady = (params) => {
//     setGridApi(params.api);
//     setGridColumnApi(params.columnApi);

//     // params.api.getDisplayedRowAtIndex(0).setExpanded(true);
//   };

//   return (
//     <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
//       <AgGridReact
//         defaultColDef={{
//           flex: 1,
//           minWidth: 100,
//           sortable: true,
//           resizable: true,
//         }}
//         // groupDefaultExpanded="1"
//         autoGroupColumnDef={{ minWidth: 200, headerName: 'Make' }}
//         animateRows={true}
//         onGridReady={onGridReady}
//         rowData={rowData}
//       >
//         {/* <AgGridColumn field="make" rowGroup={true} hide={true}></AgGridColumn>
//         <AgGridColumn field="model"></AgGridColumn>
//         <AgGridColumn field="price"></AgGridColumn> */}
//       </AgGridReact>
//     </div>
//   );
// };

// export default App;












import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "ag-grid-enterprise";
// import 'ag-grid-enterprise';
import "ag-grid-charts-enterprise";

import { AgGridReact } from "ag-grid-react";
import { getCountries } from "./countries";
import { CustomAgeFilter } from "./customAgeFilter";
import { createFakeServer, createServerSideDatasource } from "./server";

import { LicenseManager } from "ag-grid-enterprise";



LicenseManager.setLicenseKey('CompanyName=Equinix Asia Pacific pte ltd,LicensedGroup=equinixMendixPrivateLib,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-027567,SupportServicesEnd=18_June_2023_[v2]_MTY4NzA0MjgwMDAwMA==4be2c388f9a8a7443c72842dff53d5b2');




const countries = getCountries();

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", enableRowGroup: true, filter: false },
    {
      field: "age",
      enableRowGroup: true,
      enablePivot: true,
      filter: CustomAgeFilter,
    },
    {
      field: "country",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: { values: countries },
    },
    {
      field: "year",
      enableRowGroup: true,
      enablePivot: true,
      rowGroup: true,
      hide: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["2000", "2002", "2004", "2006", "2008", "2010", "2012"],
      },
    },
    { field: "sport", enableRowGroup: true, enablePivot: true, filter: false },
    { field: "gold", aggFunc: "sum", filter: false, enableValue: true },
    { field: "silver", aggFunc: "sum", filter: false, enableValue: true },
    { field: "bronze", aggFunc: "sum", filter: false, enableValue: true },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      allowedAggFuncs: ["sum", "min", "max", "random"],
      filter: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      width: 180,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className="ag-theme-quartz-dark"
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType="serverSide"
          rowGroupPanelShow="always"
          pivotPanelShow="always"
          sideBar={true}
          maxConcurrentDatasourceRequests={1}
          maxBlocksInCache={2}
          purgeClosedRowNodes={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default GridExample;
