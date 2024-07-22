// src/components/AddClient.js
import React, { useState } from 'react';
import axios from 'axios';

function AddClient() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [clientType, setClientType] = useState('individual');
    const [message, setMessage] = useState('');

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/clients', { name, address, contact_info: contactInfo, client_type: clientType }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Client added successfully');
        } catch (error) {
            setMessage('Failed to add client');
        }
    };

    return (
        <div>
            <h2>Add Client</h2>
            <form onSubmit={handleAddClient}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                    <label>Contact Info:</label>
                    <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                </div>
                <div>
                    <label>Client Type:</label>
                    <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                    </select>
                </div>
                <button type="submit">Add Client</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddClient;
