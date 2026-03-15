import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import ContactWidget from '../components/ContactWidget';

const CustomerLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50">
                <Outlet /> 
            </main>
            <Footer />
            <ContactWidget/>
            <AIChatbot />
            
        </div>
    );
};

export default CustomerLayout;