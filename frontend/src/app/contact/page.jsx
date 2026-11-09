'use client';

import React, { useState } from 'react';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Message Sent!', {
      description: 'Thank you for reaching out. Our team will contact you shortly.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="furniro-contact-page">
      <PageBanner title="Contact" breadcrumb={[{ label: 'Contact' }]} />

      <main className="section-container contact-main-section">
        <div className="contact-heading-box">
          <h2 className="contact-main-title">Get In Touch With Us</h2>
          <p className="contact-main-subtitle">
            For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. Our Staff Always There To Help You Out. Do Not Hesitate!
          </p>
        </div>

        <div className="contact-layout-grid">
          {/* Left Info Column */}
          <div className="contact-info-column">
            <div className="contact-info-item">
              <div className="info-icon-wrapper">
                <img src="/images/furniro/iconLocation.svg" alt="" className="info-icon" />
              </div>
              <div className="info-text">
                <h3 className="info-item-title">Address</h3>
                <p className="info-item-desc">
                  236 5th SE Avenue, New York NY10000, United States
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon-wrapper">
                <img src="/images/furniro/iconPhone.svg" alt="" className="info-icon" />
              </div>
              <div className="info-text">
                <h3 className="info-item-title">Phone</h3>
                <p className="info-item-desc">
                  Mobile: +(84) 546-6789
                  <br />
                  Hotline: +(84) 456-6789
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon-wrapper">
                <img src="/images/furniro/iconClock.svg" alt="" className="info-icon" />
              </div>
              <div className="info-text">
                <h3 className="info-item-title">Working Time</h3>
                <p className="info-item-desc">
                  Monday-Friday: 9:00 - 22:00
                  <br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="contact-form-column">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-field">
                <label htmlFor="contact-name">Your name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  placeholder="Abc"
                  value={formData.name}
                  onChange={handleChange}
                  className="furniro-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact-email">Email address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  placeholder="Abc@def.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="furniro-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  placeholder="This is an optional"
                  value={formData.subject}
                  onChange={handleChange}
                  className="furniro-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Hi! i’d like to ask about"
                  value={formData.message}
                  onChange={handleChange}
                  className="furniro-textarea"
                />
              </div>

              <div className="form-submit-wrapper">
                <button type="submit" className="furniro-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <FeaturesBar />
    </div>
  );
}
