'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name (min 2 characters)'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    toast.success('Message Sent Successfully!', {
      description: `Thank you ${data.name}. Our Furniro team will contact you at ${data.email} shortly.`,
    });
    reset();
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

          {/* Right Contact Form with React Hook Form + Zod */}
          <div className="contact-form-column">
            <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
              <div className="form-field">
                <label htmlFor="contact-name">Your name</label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="Abc"
                  {...register('name')}
                  className="furniro-input"
                />
                {errors.name && (
                  <span className="text-xs text-rose-600 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-email">Email address</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="Abc@def.com"
                  {...register('email')}
                  className="furniro-input"
                />
                {errors.email && (
                  <span className="text-xs text-rose-600 mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  placeholder="This is an optional"
                  {...register('subject')}
                  className="furniro-input"
                />
                {errors.subject && (
                  <span className="text-xs text-rose-600 mt-1 block">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Hi! i’d like to ask about"
                  {...register('message')}
                  className="furniro-textarea"
                />
                {errors.message && (
                  <span className="text-xs text-rose-600 mt-1 block">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <div className="form-submit-wrapper">
                <button type="submit" disabled={isSubmitting} className="furniro-submit-btn">
                  {isSubmitting ? 'Sending...' : 'Submit'}
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
