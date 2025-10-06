import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsignList from '../../components/consign/ConsignList';
import ConsignDetails from '../../components/consign/ConsignDetails';

const ConsignManager = () => {
    return (
        <Routes>
            {/* Danh sách consign ở /consigns */}
            <Route path="/" element={<ConsignList />} />
            {/* Chi tiết consign ở /consigns/:id */}
            <Route path=":id" element={<ConsignDetails />} />
        </Routes>
    );
};

export default ConsignManager;
