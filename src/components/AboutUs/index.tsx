'use client'

import React, { useState } from 'react'
import { Mail, Twitter, Linkedin, Youtube, Facebook, Instagram, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import RichText from '@/components/RichText'

interface TeamMember {
  name: string
  title: string
  bio?: string
  photo?: {
    url?: string
    alt?: string
  } | string
}

interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'youtube' | 'facebook' | 'instagram' | 'tiktok'
  url: string
}

interface AboutUsData {
  pageTitle?: string
  missionTitle?: string
  missionContent?: any
  aboutContent?: any
  teamTitle?: string
  teamMembers?: TeamMember[]
  contactTitle?: string
  contactEmail?: string
  contactPhone?: string
  location?: string
  locationDetails?: string
  showContactForm?: boolean
  socialTitle?: string
  socialDescription?: string
  socialLinks?: SocialLink[]
}

const socialIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Instagram,
}

const socialLabels = {
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
}

export function AboutUs({ data }: { data: AboutUsData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Thank you for your message! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please check your connection and try again.')
    }

    setTimeout(() => {
      setSubmitStatus('idle')
      setSubmitMessage('')
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className=" min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-[20px] font-medium mb-2">
            {data.pageTitle || 'About Us'}
          </h1>
        </div>

        {/* Single Card with All Content */}
        <div className=" mb-6">
          {/* Mission Statement */}
          {data.missionContent && (
            <section className="p-4 border-b border-gray-100">
              <h2 className="text-gray-900 text-base font-medium mb-3">
                {data.missionTitle || 'Our Mission'}
              </h2>
              <div className="text-gray-700 prose prose-base max-w-none">
                <RichText content={data.missionContent} />
              </div>
              {data.aboutContent && (
                <div className="mt-3 text-gray-700 prose prose-base max-w-none">
                  <RichText content={data.aboutContent} />
                </div>
              )}
            </section>
          )}

          {/* Team Section - Compact */}
          {data.teamMembers && data.teamMembers.length > 0 && (
            <section className="p-4 border-b border-gray-100">
              <h2 className="text-gray-900 text-base font-medium mb-3">
                {data.teamTitle || 'Our Team'}
              </h2>
              <div className="space-y-3">
                {data.teamMembers.map((member, index) => {
                  const photoUrl = typeof member.photo === 'object' ? member.photo?.url : null
                  const photoAlt = typeof member.photo === 'object' ? member.photo?.alt : member.name

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {photoUrl ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={photoUrl}
                            alt={photoAlt || member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-indigo-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-indigo-600">{member.title}</p>
                        {member.bio && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="p-4 border-b border-gray-100">
            <h2 className="text-gray-900 text-base font-medium mb-3">
              {data.contactTitle || 'Contact Us'}
            </h2>

            {/* Contact Info */}
            {(data.contactEmail || data.contactPhone || data.location) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {data.contactEmail && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Email</p>
                      <a href={`mailto:${data.contactEmail}`} className="text-sm text-indigo-600 hover:underline break-all">
                        {data.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {data.contactPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Phone</p>
                      <a href={`tel:${data.contactPhone}`} className="text-sm text-indigo-600 hover:underline">
                        {data.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Location</p>
                      <p className="text-sm text-gray-600">
                        {data.location}
                        {data.locationDetails && (
                          <>
                            <br />
                            {data.locationDetails}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Form */}
            {data.showContactForm !== false && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {submitMessage && (
                    <p className={`text-base font-medium ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {submitMessage}
                    </p>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Social Media */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="p-4">
              <h2 className="text-gray-900 text-base font-medium mb-3">
                {data.socialTitle || 'Follow Us'}
              </h2>
              {data.socialDescription && (
                <p className="text-base text-gray-600 mb-3">
                  {data.socialDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {data.socialLinks.map((social, index) => {
                  const Icon = socialIcons[social.platform]
                  const label = socialLabels[social.platform]

                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-700" />
                      <span className="text-base font-medium text-gray-700">{label}</span>
                    </a>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
