module.exports = {
    // 로더 등록
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                exclude: ['/node_modules/'],
            },
        ],
    },
};