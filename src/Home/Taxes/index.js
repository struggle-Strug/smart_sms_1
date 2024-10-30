import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import SetProductDetail from './detail';
// import SetProductEdit from './edit';
// import SetProductAdd from './add';

const { ipcRenderer } = window.require('electron');

function TaxList() {
    return (
        <div>test</div>
    )
}

function TaxesIndex() {
    return (
        <Routes>
            <Route path="" element={<TaxList />} />
            {/* <Route path="edit/:id" element={<SetProductEdit />} /> */}
            {/* <Route path="add" element={<SetProductAdd />} /> */}
            {/* <Route path="detail/:id" element={<SetProductDetail />} /> */}
        </Routes>
    )
}

export default TaxesIndex;
