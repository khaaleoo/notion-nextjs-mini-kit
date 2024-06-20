/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // TODO: remove this rule upon your demand
      {
        source: "/",
        destination: "/blog",
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      loader: "svg-inline-loader",
    });
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        hostname: "www.notion.so",
      },
    ],
  },
};

export default nextConfig;
