const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
/**
 * @type {import('webpack').Configuration}
 */

module.exports = {
  mode: "production",
  optimization: {
    minimize: false, // 是否压缩代码
    chunkIds: "named",
    runtimeChunk: "single",
    splitChunks: {
      // 代码分割配置
      chunks: "all",
      cacheGroups: {
        // 单独打包 Vue 及其生态包，优先级最高
        vue: {
          name: "vue", // 自定义 chunkName
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|@vue)[\\/]/,
          priority: 20, // 优先级高于 vendor，确保先匹配
          chunks: "all",
        },
        // 其余第三方依赖统一打包
        vendor: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial", // 影响HTML脚本标签
        },
        // 将 src/styles 下的样式单独打包成一个 CSS chunk
        styles: {
          name: "chunk-styles",
          test: /[\\/]src[\\/]styles[\\/].*\.(css|less)$/,
          type: "css/mini-extract",
          priority: 30,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"), // 打包后的目录
    filename: "js/[name].[contenthash:6].js", // 打包后的文件名
    clean: true, // 清除上一次打包的文件
    publicPath: "/", // 打包后的资源的访问路径前缀
  },
  stats: "errors-warnings", // 只输出错误和警告信息，减少构建日志的冗余
  //   插件
  plugins: [
    // 生成html文件的插件；会自动引入打包后的js文件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      title: "Webpack Vue template",
    }),
    // 拷贝public文件夹
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./public"),
          to: path.resolve(__dirname, "./dist"),
          toType: "dir",
          globOptions: {
            ignore: ["**/index.html"],
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),
    new VueLoaderPlugin(), // vue-loader插件；处理.vue文件
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:6].css", // 打包后的css文件名
    }), // 提取css文件的插件
    new ESLintPlugin({
      extensions: ["js", "ts", "vue", "jsx", "tsx"],
      exclude: "node_modules",
      context: path.resolve(__dirname, "../src"),
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache",
      ),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ 代表 src 路径
    },
    // 引入文件的时候不需要添加后缀，这个配置也会稍微的提升构建速度
    extensions: [".js", ".ts", ".vue", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      //   css 样式资源
      {
        // 样式文件处理；oneOf表示只会匹配第一个符合条件的规则，后续的规则不会再去匹配
        oneOf: [
          {
            test: /\.css$/,
            exclude: [/node_modules/],
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          },
          {
            test: /\.less$/,
            exclude: [/node_modules/],
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
              "less-loader",
              {
                loader: "style-resources-loader", // 全局引入变量文件
                options: {
                  patterns: [path.resolve(__dirname, "./src/styles/var.less")],
                },
              },
            ],
          },
          {
            test: /\.module\.css$/i,
            exclude: [/node_modules/],
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[name]__[local]__[hash:base64:5]",
                  },
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      // 静态资源
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: "asset", // webpack5通用资源处理模块，默认8kb以下的资源会被转换为base64
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: "img/[name].[contenthash:6][ext]", //文件打包输出目录
        },
      },
      {
        test: /\.(svg)(\?.*)?$/,
        type: "asset/resource", // webpack5通用资源处理模块，默认会导出出单独的文件
        generator: {
          filename: "img/[name].[contenthash:6][ext]", //文件打包输出目录
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // 2kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: "fonts/[name].[contenthash:6][ext]", //文件打包输出目录
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 20kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: "media/[name].[contenthash:6][ext]", //文件打包输出目录
        },
      },
    ],
  },
};
