import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutUs from './AboutUs.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermOfUse from './Term.jsx';

export default function GeneralInformation(arams) {
    return(
        <Routes>
            <Route path="about-us" element={<AboutUs/>}/>
            <Route path="privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="term-of-use" element={<TermOfUse/>}/>
        </Routes>
    )
}