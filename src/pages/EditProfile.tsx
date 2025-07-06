import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
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
          // If profile doesn't exist, we'll create it when form is submitted
          return { profile: null };
        }
        return res.json();
      })
      .then(data => {
        const profileData = data.profile || {};
        setUser(profileData);
        setProfile(profileData);
        setForm({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          profile_picture: profileData.profile_picture || '',
          headline: profileData.headline || '',
          summary: profileData.summary || '',
          location: profileData.location || '',
          website: profileData.website || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          years_of_experience: profileData.years_of_experience || '',
          current_salary: profileData.current_salary || '',
          desired_salary: profileData.desired_salary || '',
        });
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        // Continue with empty form if there's an error
      });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Profile updated!');
        navigate('/profile');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (!user) return <div className="min-h-screen pt-20 px-4 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 px-4 max-w-2xl mx-auto">
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-3xl font-bold gradient-text mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" type="email" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Profile Picture URL</label>
              <input name="profile_picture" value={form.profile_picture} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Headline</label>
              <input name="headline" value={form.headline} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Summary</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Website</label>
              <input name="website" value={form.website} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">LinkedIn URL</label>
              <input name="linkedin_url" value={form.linkedin_url} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">GitHub URL</label>
              <input name="github_url" value={form.github_url} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Years of Experience</label>
              <input name="years_of_experience" value={form.years_of_experience} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" type="number" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Current Salary</label>
              <input name="current_salary" value={form.current_salary} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Desired Salary</label>
              <input name="desired_salary" value={form.desired_salary} onChange={handleChange} className="w-full glass rounded-lg px-3 py-2" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mt-4"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 