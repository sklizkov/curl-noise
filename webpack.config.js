const
  path                       = require('path'),
  CopyWebpackPlugin          = require('copy-webpack-plugin'),
  HtmlWebpackPlugin          = require('html-webpack-plugin'),
  MiniCSSExtractPlugin       = require('mini-css-extract-plugin'),
  HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default


const
  packageJson = require('./package.json')


module.exports = (env) => {

  return {

    mode: env.development ? 'development' : 'production',

    entry: {
      main: './src/scripts/index.js',
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    module: {
      rules: [
        // HTML
        {
          test: /\.hbs$/,
          use: [ 'handlebars-loader' ]
        },

        // CSS
        {
          test: /\.styl$/,
          use: [ MiniCSSExtractPlugin.loader, 'css-loader', 'stylus-loader' ]
        },

        // JS
        {
          test: /\.js$/,
          exclude: /node_modules/, use: [ 'babel-loader' ]
        },

        // Shaders
        {
          test: /\.(glsl|vert|frag)$/,
          exclude: /node_modules/, use: [ 'raw-loader', 'glslify-loader' ]
        },

        // Images
        {
          test: /\.(jpg|png|svg)$/,
          use: [ { loader: 'file-loader', options: { outputPath: 'assets/images/' } } ],
        },
      ]
    },

    plugins: [
      // Static
      new CopyWebpackPlugin({
        patterns: [ { from: './static' } ],
      }),

      // HTML
      new HtmlWebpackPlugin({
        template: './src/templates/index.hbs',
        title: packageJson.name,
        description: packageJson.description,
        repo: packageJson.repository.url,
      }),

      // CSS
      new MiniCSSExtractPlugin(),
      // new HTMLInlineCSSWebpackPlugin(),
    ],

    resolve: {
      // Aliases
      alias: {
        Scripts: path.resolve(__dirname, 'src/scripts/'),
        Shaders: path.resolve(__dirname, 'src/shaders/'),
        Styles: path.resolve(__dirname, 'src/styles/'),
        Templates: path.resolve(__dirname, 'src/templates/'),
      },
    },

    devServer: {
      static: './dist',
      port: 1337,
      open: true,
    },

  }

}