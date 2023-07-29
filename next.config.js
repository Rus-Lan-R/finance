const path = require("path");
const rootPath = path.resolve(__dirname, "../");
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins(
  [
    // place for future plugins
  ],
  {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias["@"] = rootPath;
      config.resolve.alias["~"] = rootPath;
      config.resolve.alias["assets"] = `${rootPath}/assets`;

      config.module.rules = config.module.rules.map((rule) => {
        if (
          String(rule.test) ===
          String(
            /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/
          )
        ) {
          return {
            ...rule,
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          };
        }

        return rule;
      });

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      });

      return config;
    },
  }
);
