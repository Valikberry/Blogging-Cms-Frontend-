import type { GlobalConfig } from 'payload'

export const AboutUs: GlobalConfig = {
  slug: 'about-us',
  label: 'About Us',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      defaultValue: 'About Us',
      label: 'Page Title',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Mission & Background',
          fields: [
            {
              name: 'missionTitle',
              type: 'text',
              defaultValue: 'Our Mission',
              label: 'Mission Section Title',
            },
            {
              name: 'missionContent',
              type: 'richText',
              label: 'Mission Statement',
              required: true,
            },
            {
              name: 'aboutContent',
              type: 'richText',
              label: 'About Content (Additional paragraphs)',
            },
          ],
        },
        {
          label: 'Team',
          fields: [
            {
              name: 'teamTitle',
              type: 'text',
              defaultValue: 'Our Team',
              label: 'Team Section Title',
            },
            {
              name: 'teamMembers',
              type: 'array',
              label: 'Team Members',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Full Name',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Job Title',
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  label: 'Bio',
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Profile Photo',
                },
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'Contact Information',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              defaultValue: 'Contact Us',
              label: 'Contact Section Title',
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Contact Email',
              defaultValue: 'info@askgeopolitics.com',
              required: true,
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Phone Number (Optional)',
            },
            {
              name: 'location',
              type: 'text',
              label: 'Location',
              defaultValue: 'Global Newsroom',
            },
            {
              name: 'locationDetails',
              type: 'textarea',
              label: 'Location Details',
              defaultValue: 'Available Worldwide',
            },
            {
              name: 'showContactForm',
              type: 'checkbox',
              label: 'Show Contact Form',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialTitle',
              type: 'text',
              defaultValue: 'Follow Us',
              label: 'Social Media Section Title',
            },
            {
              name: 'socialDescription',
              type: 'textarea',
              label: 'Social Media Description',
              defaultValue: 'Stay connected with us on social media for the latest updates and insights.',
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Media Links',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'URL',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
