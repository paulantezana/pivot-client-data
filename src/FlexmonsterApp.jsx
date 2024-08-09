import * as FlexmonsterReact from "react-flexmonster";



const report = {
  dataSource: {
    type: "microsoft analysis services",
    proxyUrl: "http://localhost:9595/msmdpump.dll",
    catalog: "TabularProject1_PAntezana_09492e7a-cb43-44f0-bce5-7a3f3577b831",
    cube: "Model",
    withCredentials: true
  }
}

const FlexmonsterApp = () => (
  <div>
    <FlexmonsterReact.Pivot toolbar={true} report={report} />
  </div>
);

export default FlexmonsterApp;
