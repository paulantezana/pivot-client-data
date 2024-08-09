import React from 'react';

import 'devextreme/dist/css/dx.light.css';

import PivotGrid from 'devextreme-react/pivot-grid';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

const myStore = new XmlaStore({
  url: 'http://localhost:5266/OLAP/queryXMLA',
  catalog: 'TabularProject1_PAntezana_09492e7a-cb43-44f0-bce5-7a3f3577b831',
  cube: 'Model',
});

const myDataSource = new PivotGridDataSource({
  store: myStore
});


async function enviarQuery() {
  const xmlRequest = `
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" flexmonster="true">
          <SOAP-ENV:Body>
              <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                  <RequestType>DISCOVER_DATASOURCES</RequestType>
                  <Restrictions/>
                  <Properties/>
              </Discover>
          </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;

  const response = await fetch('http://localhost:9595/msmdpump.dll', {
      method: 'POST',
      headers: {
          'Content-Type': 'text/xml',
          'Authorization': 'Basic ' + btoa('pAntezana@grupoValor.com:paan2021$')
      },
      body: xmlRequest
  });

  if (response?.ok) {
      const data = await response?.text();
      console.log(data);  // Maneja la respuesta del SSAS aquí
  } else {
      console.error('Error:', response?.statusText);
  }
}

class DevEx extends React.Component {
  render() {
    return (
      <div>
        <button onClick={enviarQuery} >ENVIAR QUERY</button>
        <PivotGrid
          dataSource={myDataSource}
        />
      </div>
    );
  }
}

export default DevEx;
