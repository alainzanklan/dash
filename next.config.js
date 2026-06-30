/** @type {import('next').NextConfig} */
module.exports = {
  // images: {
  //   remotePatterns: [
  // //     {
  // //       // domains: ['firebasestorage.googleapis.com'],
  // //       protocol: 'https',
  // //       hostname: 'firebasestorage.googleapis.com',
  // //       port: '',
  // //       pathname: 'gs://emart-gh.appspot.com/**',
  // //     },
  // //   ],
  // // },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'res.cloudinary.com',
      'images.unsplash.com',
    ],
  },
};
