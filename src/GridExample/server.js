export function createServerSideDatasource(fakeServer) {
    class ServerSideDatasource {
        constructor(fakeServer) {
            this.fakeServer = fakeServer;
        }

        getRows(params) {
            this.fakeServer.getData(params.request, (resultForGrid, lastRow, pivotFields) => {
                params.success({
                    rowData: resultForGrid,
                    rowCount: lastRow,
                    pivotResultFields: pivotFields,
                });
            });
        }
    }

    return new ServerSideDatasource(fakeServer);
}

export function createFakeServer(data) {
    return new FakeServer(data);
}

class FakeServer {
    constructor(allData) {
        this.allData = allData;
    }

    getData(request, callback) {
        // console.log({request}, '____request____')
        const { filterModel, pivotCols, pivotMode, groupKeys, rowGroupCols, valueCols, sortModel } = request;

        const pivotActive = pivotMode && pivotCols.length > 0 && valueCols.length > 0;

        let rowData = this.filterList(this.allData, filterModel);

        let pivotFields = null;
        if (pivotActive) {
            const pivotResult = this.pivot(pivotCols, rowGroupCols, valueCols, rowData);
            rowData = pivotResult.data;
            valueCols = pivotResult.aggCols;
            pivotFields = pivotResult.pivotFields;
        }

        if (rowGroupCols.length > 0) {
            rowData = this.filterOutOtherGroups(rowData, groupKeys, rowGroupCols);
            const showingGroupLevel = rowGroupCols.length > groupKeys.length;
            if (showingGroupLevel) {
                rowData = this.buildGroupsFromData(rowData, rowGroupCols, groupKeys, valueCols);
            }
        } else if (pivotMode) {
            const rootGroup = this.aggregateList(rowData, valueCols);
            rowData = [rootGroup];
        }

        rowData = this.sortList(rowData, sortModel);

        const lastRow = rowData.length;

        if (request.startRow != null && request.endRow != null) {
            rowData = rowData.slice(request.startRow, request.endRow);
        }

        setTimeout(() => {
            callback(rowData, lastRow, pivotFields);
        }, 1000);
    }

    sortList(data, sortModel) {
        if (!sortModel || sortModel.length === 0) return data;

        return data.slice().sort((a, b) => {
            for (let i = 0; i < sortModel.length; i++) {
                const { colId, sort } = sortModel[i];
                const valueA = a[colId];
                const valueB = b[colId];
                if (valueA === valueB) continue;
                return (valueA > valueB ? 1 : -1) * (sort === 'asc' ? 1 : -1);
            }
            return 0;
        });
    }

    filterList(data, filterModel) {
        if (!filterModel || Object.keys(filterModel).length === 0) return data;

        return data.filter(item => {
            if (filterModel.age) {
                const age = item.age;
                const allowedAge = parseInt(filterModel.age.filter);
                if (filterModel.age.type === 'equals' && age !== allowedAge) return false;
                if (filterModel.age.type === 'lessThan' && age >= allowedAge) return false;
                if (filterModel.age.type !== 'equals' && filterModel.age.type !== 'lessThan' && age <= allowedAge) return false;
            }

            if (filterModel.year && !filterModel.year.values.includes(item.year.toString())) return false;

            if (filterModel.country && !filterModel.country.values.includes(item.country)) return false;

            return true;
        });
    }

    pivot(pivotCols, rowGroupCols, valueCols, data) {
        const pivotData = [];
        const aggColsList = [];
        const pivotFields = new Set();

        data.forEach(item => {
            const pivotValues = pivotCols.map(pivotCol => item[pivotCol.id]?.toString() || '-');
            const pivotItem = {};

            valueCols.forEach(valueCol => {
                const colKey = `${pivotValues.join('_')}_${valueCol.id}`;
                if (!pivotFields.has(colKey)) {
                    pivotFields.add(colKey);
                    aggColsList.push({ id: colKey, field: colKey, aggFunc: valueCol.aggFunc });
                }
                pivotItem[colKey] = item[valueCol.id];
            });

            rowGroupCols.forEach(rowGroupCol => {
                pivotItem[rowGroupCol.id] = item[rowGroupCol.id];
            });

            pivotData.push(pivotItem);
        });

        return { data: pivotData, aggCols: aggColsList, pivotFields: Array.from(pivotFields) };
    }

    buildGroupsFromData(rowData, rowGroupCols, groupKeys, valueCols) {
        const field = rowGroupCols[groupKeys.length].id;
        const mappedRowData = this.groupBy(rowData, field);

        if (!mappedRowData) return [];

        return Object.keys(mappedRowData).map(key => {
            const groupItem = this.aggregateList(mappedRowData[key], valueCols);
            groupItem[field] = key;
            return groupItem;
        });
    }

    aggregateList(rowData, valueCols) {
        const result = {};

        valueCols.forEach(col => {
            const field = col.id;

            switch (col.aggFunc) {
                case 'sum':
                    result[field] = rowData.reduce((sum, row) => sum + (row[field] ?? 0), 0);
                    break;
                case 'min':
                    result[field] = rowData.reduce((min, row) => (min === null || min > row[field]) ? row[field] : min, null);
                    break;
                case 'max':
                    result[field] = rowData.reduce((max, row) => (max === null || max < row[field]) ? row[field] : max, null);
                    break;
                case 'random':
                    result[field] = Math.random();
                    break;
                default:
                    console.warn(`Unrecognized aggregation function: ${col.aggFunc}`);
            }
        });

        return result;
    }

    filterOutOtherGroups(originalData, groupKeys, rowGroupCols) {
        let filteredData = originalData;

        groupKeys.forEach((groupKey, index) => {
            const field = rowGroupCols[index].id;
            filteredData = filteredData.filter(item => item[field] == groupKey);
        });

        return filteredData;
    }

    groupBy(data, field) {
        return data.reduce((result, item) => {
            const key = item[field];
            if (!result[key]) result[key] = [];
            result[key].push(item);
            return result;
        }, {});
    }
}
