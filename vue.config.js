// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');
const px2rem = require('postcss-pxtorem');
const postcss = px2rem({
    rootValue: 32, // 换算的基数
    selectorBlackList: ['el-'], // 忽略转换正则匹配项
    propList: ['*'],
    mediaQuery: true,
    // minPixelValue: 13
    minPixelValue: 1

});
module.exports = {
    devServer:{
        disableHostCheck: true,
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    // postcss
                ]
            }
        }
    },
    chainWebpack: config => {
        config.plugin('define').tap(args => {
          const argv = process.argv
          const icourt = argv[argv.indexOf('--icourt-mode') + 1]
    
          args[0]['process.env'].MODE = `"${icourt}"`
    
          return args
        })
        // svg rule loader
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
          .test(/\.svg$/)
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]',
          })
    
        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(path.resolve('src/icons'))
        config.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      },
    configureWebpack: config => {
        if (process.env.NODE_ENV !== 'production') return;
        return {
            plugins: [
                // new PrerenderSPAPlugin({
                //     // 生成文件的路径，也可以与webpakc打包的一致。
                //     // 下面这句话非常重要！！！
                //     // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
                //     staticDir: path.join(__dirname, 'dist'),
                //     // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
                //     routes: ['/'],
                //     // 这个很重要，如果没有配置这段，也不会进行预编译
                //     renderer: new Renderer({
                //         inject: {
                //             foo: 'bar'
                //         },
                //         headless: false,
                //         // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
                //         renderAfterDocumentEvent: 'render-event'
                //     })
                // }),
            ],
        };
    },
    devServer: {
        proxy: {
            '/report/api': {
                target: ' https://in.com:1443',
                pathRewrite: {
                    '^/report/api': ''
                }
            }
        }
    }
}