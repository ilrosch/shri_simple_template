const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StatoscopePlugin = require("@statoscope/webpack-plugin").default;
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-proposal-class-properties"],
  },
};

const config = {
  mode: "development",
  entry: {
    index: "./public/index.html",
    about: "./src/pages/About.js",
    home: "./src/pages/Home.js",
  },

  // Только для development-режима

  // Cтиль карт ресурсов (source maps)
  devtool: "eval-cheap-source-map",
  // End. Cтиль карт ресурсов (source maps)

  // Настройка сервера разработки
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
  // End. Настройка сервера разработки

  // End. Только для development-режима

  // Только для production-режима
  optimization: {
    runtimeChunk: "single",
    minimize: true,
    moduleIds: "deterministic",
    innerGraph: true,
    concatenateModules: true,
    splitChunks: {
      chunks: "all",
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  // End. Только для production-режима

  plugins: [
    new HtmlWebpackPlugin(),

    new StatoscopePlugin({
      saveStatsTo: "stats.json",
      saveOnlyStats: false,
      open: false,
    }),
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      // JavaScript, React
      {
        test: /\.m?jsx?$/i,
        exclude: /node_modules/,
        use: babelLoader,
      },
      // TypeScript
      {
        test: /.tsx?$/i,
        exclude: /node_modules/,
        use: [babelLoader, "ts-loader"],
      },

      // HTML
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff?2)$/i,
        type: "asset",
      },
    ],
  },

  // @TODO lodash treeshaking
  // @TODO fallback for crypto
};
module.exports = config;
