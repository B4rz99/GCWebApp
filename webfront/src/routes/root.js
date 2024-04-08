import React from 'react'
import { Navigate, Outlet } from "react-router-dom";


export default function Root() {
    return (
        <>
            <main>
                <Outlet/>
            </main>
        </>
        
    )
}