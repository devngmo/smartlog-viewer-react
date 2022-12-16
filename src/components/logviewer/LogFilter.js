import { useState } from "react";
import { NavbarBrand, NavItem, NavLink } from "react-bootstrap";
import EditFilterDialog from "./EditFilterDialog";
import {v4 as uuidv4 } from 'uuid';

import './LogFilter.css';

const initVerboseFlags = [
    { v: 'i', label: 'Info', selected: true },
    { v: 'd', label: 'Debug', selected: true },
    { v: 'w', label: 'Warning', selected: true },
    { v: 'e', label: 'Error', selected: true },
];

const LogFilter = ({filterTags, verboseFlags, onFilterTagsChanged, onFilterVerboseFlagChanged}) => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [verboseTogglers, setVerboseTogglers] = useState(initVerboseFlags);
    if (savedFilters.length === 0) {
        let savedData = localStorage.getItem('filters');
        if (savedData === null || savedData === undefined) {
            setSavedFilters([{ id: '__new__', name:'New', tags: []}]);
        } else {
            setSavedFilters(JSON.parse(savedData));
        }
    }

    const [filterIndex, setFilterIndex] = useState(0);
    
    const parseAndSaveTagsFromInput = (inputText) => {
        onFilterTagsChanged(inputText.split('|'));
        console.log('on filter tag updated: ' + inputText);
    };

    const [showDlg, setShowDlg] = useState(false);


    let savedFilterItems = [];
    savedFilters.map((f, index) => {
        savedFilterItems.push(
        <option key={index}>{f.name}</option>
        );
    });

    const saveFilterTags=() => {
        if (filterIndex === 0) {
            setShowDlg(true);
        } else {

        }
    }

    const onConfirmSaveFilter = (name) => {
        if (filterIndex === 0) {
            let filters = savedFilters.concat({id:uuidv4(), name: name, tags: filterTags});
            localStorage.setItem('filters', JSON.stringify(filters));
            setSavedFilters(filters);
        }
        else {
            savedFilters[filterIndex].name = name;
            localStorage.setItem('filters', JSON.stringify(savedFilters));
            setSavedFilters(savedFilters);
            setFilterIndex(savedFilters.length);
        }
        setShowDlg(false);
    };

    const onFilterDropdownSelectionChanged = (index) => {
        setFilterIndex(index);
        onFilterTagsChanged(savedFilters[index].tags);
    };
    
    let verboseTogglerItems = [];
    for(let i = 0; i < verboseTogglers.length; i++) {
        let v = verboseTogglers[i];
        verboseTogglerItems.push(<li 
        className={v.selected?'selected':'test'} key={i}
        onClick={() => {
            let selectedVerboses = [];
            let copy = JSON.parse(JSON.stringify(verboseTogglers));
            console.log(`toggle  ${v.label}: ${v.selected}`);
            copy[i].selected = !copy[i].selected;
            setVerboseTogglers(copy);
            copy.map(x => {
                if (x.selected) selectedVerboses.push(x.v);
            });

            onFilterVerboseFlagChanged(selectedVerboses);
        }}
        >
            {v.label} {v.selected} 
        </li>
        );
    }

    return (
        <div>
            <div className="log-filter navbar navbar-light">
                <div className="container-fluid">
                    <NavbarBrand>Tag Filters</NavbarBrand>
                    <form className="d-flex" style={{flex: 1}}>
                        <input  style={{flex: 1}} value={filterTags.join('|')} onChange={(e) => parseAndSaveTagsFromInput(e.target.value)}></input>
                        <a href="#" className="btn btn-primary" onClick={saveFilterTags}>Save</a>
                        {/* <button className="btn btn-primary" >Save</button> */}
                        <select name="saved-filters" onChange={(e) => onFilterDropdownSelectionChanged(e.target.selectedIndex)}>
                            {savedFilterItems}
                        </select>                    
                    </form>                
                </div>
            </div>

            <div className="verbose-filter navbar navbar-light">
                <div className="container-fluid">
                    <NavbarBrand>Verbose Filters</NavbarBrand>
                    <ul className="verbose-list">
                     {verboseTogglerItems}
                    </ul>
                </div>
            </div>

            <EditFilterDialog initName={filterIndex === 0?'':savedFilters[filterIndex].name} show={showDlg} 
            onSave={onConfirmSaveFilter}
            onClose={() => setShowDlg(false)} title="Edit Filter"></EditFilterDialog>
        </div>
    );
}

export default LogFilter;