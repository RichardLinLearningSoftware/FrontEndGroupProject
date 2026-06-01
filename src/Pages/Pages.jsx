import { useEffect, useState } from 'react';
import { BrowserRouter,  Route, Routes, NavLink, useSearchParams} from 'react-router';

function HomePage(){
    return(
        <h2>Home page</h2>
    );
}

function ContactPage(){
    return(
        <h2>Contact page</h2>
    );
}

function TestPage(){
    const [param] = useSearchParams();
    return(
        <h2>{param.get("id")}</h2>
    );
}

export {HomePage, ContactPage, TestPage}