import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        return res.json();
      })
      .then(data => {
        // The backend now returns combined user and profile data in data.profile
        setUser(data.profile || null);
        setProfile(data.profile || null);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, redirect to edit profile
        navigate('/profile/edit');
      });
  }, [navigate]);

  if (!user) return <div className="min-h-screen pt-20 px-4 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 px-4 max-w-2xl mx-auto">
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center space-x-6 mb-6">
          {user.profile_picture && (
            <img src={user.profile_picture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-purple-500" />
          )}
          <div>
            <h2 className="text-3xl font-bold gradient-text">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-300">{user.email}</p>
            <p className="text-gray-400 text-sm">{user.phone}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Profile Details</h3>
          {profile && (profile.headline || profile.summary || profile.location) ? (
            <ul className="text-gray-200 space-y-1">
              <li><b>Headline:</b> {profile.headline || '—'}</li>
              <li><b>Summary:</b> {profile.summary || '—'}</li>
              <li><b>Location:</b> {profile.location || '—'}</li>
              <li><b>Website:</b> {profile.website || '—'}</li>
              <li><b>LinkedIn:</b> {profile.linkedin_url || '—'}</li>
              <li><b>GitHub:</b> {profile.github_url || '—'}</li>
              <li><b>Experience:</b> {profile.years_of_experience || '—'} years</li>
              <li><b>Current Salary:</b> {profile.current_salary || '—'}</li>
              <li><b>Desired Salary:</b> {profile.desired_salary || '—'}</li>
            </ul>
          ) : (
            <div className="text-gray-400 mb-4">
              No profile details found. Click "Edit Profile" to add your information.
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="py-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ViewProfile; 