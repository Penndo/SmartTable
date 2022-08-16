module.exports = function (config, entry) {
  config.node = entry.isPluginCommand ? false : {
    setImmediate: false
  };
  config.resolve.extensions = ['.js', '.jsx'];
  config.module.rules.push({
    test: /\.(html)$/,
    use: [{
        loader: "@skpm/extract-loader",
      },
      {
        loader: "html-loader",
        options: {
          attrs: [
            'img:src',
            'link:href'
          ],
          interpolate: true,
        },
      },
    ]
  })
  config.module.rules.push({
    test: /\.(css)$/,
    use: [
      {
        loader: "@skpm/extract-loader",
      },
      {
        loader: "css-loader",
      }
    ]
  })
  config.module.rules.push({
    test: /\.(less)$/,
    use: [
      "style-loader",
      {
        loader: 'css-loader',
        options: { modules: true }
      },
      "less-loader"
    ]
  })
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  })
  config.module.rules.push(
    {
      test: /\.(jpe?g|png|gif|svg)$/i, 
      loader: "file-loader?name=/public/icons/[name].[ext]"
    },
    // For newer versions of Webpack it should be
    {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: 'file-loader',
        options: {
          name: '/public/icons/[name].[ext]'
        }
    }
  )
}
