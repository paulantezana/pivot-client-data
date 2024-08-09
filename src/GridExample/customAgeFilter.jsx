import { IDoesFilterPassParams, IFilterComp, IFilterParams } from 'ag-grid-community';

export class CustomAgeFilter {
    constructor() {
        this.eGui = null;
        this.filterValue = null;
        this.params = null;
    }

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `<div>  
            <label>    
                <input type="radio" name="ageFilterValue" data-ref="btAll" checked/> All  
            </label>  
            <label>    
                <input type="radio" name="ageFilterValue" data-ref="bt20"/> 20  
            </label>  
            <label>    
                <input type="radio" name="ageFilterValue" data-ref="bt22"/> 22  
            </label>
          </div>`;

        this.filterValue = null;
        this.params = params;

        this.eGui.querySelector('[data-ref="btAll"]').addEventListener('change', this.onSelection.bind(this, null));
        this.eGui.querySelector('[data-ref="bt20"]').addEventListener('change', this.onSelection.bind(this, 20));
        this.eGui.querySelector('[data-ref="bt22"]').addEventListener('change', this.onSelection.bind(this, 22));
    }

    onSelection(value) {
        this.filterValue = value;
        this.params.filterChangedCallback();
    }

    getGui() {
        return this.eGui;
    }

    isFilterActive() {
        return this.filterValue !== null;
    }

    doesFilterPass(params) {
        const { node } = params;
        const value = this.params.getValue(node);
        return value == this.filterValue;
    }

    getModel() {
        if (this.filterValue === null) {
            return null;
        } else {
            return {
                filter: this.filterValue,
                type: 'equals',
            };
        }
    }

    setModel(model) {
        if (model && model.filter === 20) {
            this.eGui.querySelector('[data-ref="bt20"]').checked = true;
            this.filterValue = 20;
        } else if (model && model.filter === 22) {
            this.eGui.querySelector('[data-ref="bt22"]').checked = true;
            this.filterValue = 22;
        } else {
            this.eGui.querySelector('[data-ref="btAll"]').checked = true;
            this.filterValue = null;
        }
    }
}
