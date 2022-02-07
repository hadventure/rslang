const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          // options: {
          //   transpileOnly: true
          // }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(s*)css$/,
        use: [
          // MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                exportLocalsConvention: 'camelCase',
                exportGlobals: true,
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader', // 3
        ],
      },
      {
        test: /\.(?:ico|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|mp3|json)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      minify: false,
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
      favicon: './src/assets/favicon.ico',
      inject: 'body',
      base: { href: '/' }
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'src/assets', to: 'src/assets' },
    //   ],
    // }),
  ],
};
