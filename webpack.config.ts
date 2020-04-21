import * as path from 'path';

const webpackConfig = {
  entry: {
    copyFileHandler: './src/handlers/copyFileHandler.ts',
  },
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
};

export default webpackConfig;
