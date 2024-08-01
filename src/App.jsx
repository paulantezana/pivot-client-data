import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-charts-enterprise";

function formatNumber(number) {
  if (number === null || number === undefined) return '';
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const createServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log(JSON.stringify(params.request, null, 1));

      fetch('http://localhost:4000/olympicWinners/', {
        method: 'post',
        body: JSON.stringify(params.request),
        headers: { "Content-Type": "application/json; charset=utf-8" }
      })
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        })
        .catch(error => {
          console.error(error);
          params.fail();
        })
    },
  };
};

const App = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'CodigoLibro', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoDiario', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoDiarioReporte', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoModulo', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoAnio', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoAnioPeriodo', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoCuenta', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoDimensionBase', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoDimensionOperativa', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoEntidad', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoTipoCambio', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoMonedaTransaccion', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },
    { field: 'CodigoMonedaBase', cellDataType: 'text', filter: 'agTextColumnFilter', enableRowGroup: true, enablePivot: true },


    { field: 'DescripcionCompania', cellDataType: 'text', enablePivot: true },

    { field: 'DebeBase', cellDataType: 'number', aggFunc: 'sum', valueFormatter: params => formatNumber(params.value) },
    { field: 'HaberBase', cellDataType: 'number', aggFunc: 'sum', valueFormatter: params => formatNumber(params.value) },
    {
      field: 'SaldoBase', cellDataType: 'number', aggFunc: 'sum', valueFormatter: params => formatNumber(params.value),
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
    },

    { field: 'DebeSistema', cellDataType: 'number', aggFunc: 'sum' },
    { field: 'HaberSistema', cellDataType: 'number', aggFunc: 'sum' },
    { field: 'SaldoSistema', cellDataType: 'number', aggFunc: 'sum' },

    // { field: 'DebeTransacion', cellDataType: 'number', aggFunc: 'sum' },
    // { field: 'HaberTransacion', cellDataType: 'number', aggFunc: 'sum' },
    // { field: 'SaldoTransacion', cellDataType: 'number', aggFunc: 'sum' },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      minWidth: 100,

      enablePivot: true,
      sortable: true,
      resizable: true,

      filter: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    let datasource = createServerSideDatasource();
    params.api.setGridOption("serverSideDatasource", datasource);
  }, []);

  const statusBar = {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  }

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 180,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className="ag-theme-quartz-dark"
      >
        <AgGridReact
          rowModelType={"serverSide"}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          pivotMode={true}
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                  // suppressRowGroups: false,
                  // suppressValues: false,
                  // suppressPivots: false,
                  // suppressPivotMode: false,
                  // suppressSideButtons: false,
                  // suppressColumnFilter: false,
                  // suppressColumnSelectAll: false,
                  suppressExpandablePivotGroups: true,
                },
              },
              {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
              },
            ],
            defaultToolPanel: 'columns',
          }}
          onGridReady={onGridReady}

          enableRangeSelection
          enableCharts
          statusBar={statusBar}
        />
      </div>
    </div>
  );
};

export default App;