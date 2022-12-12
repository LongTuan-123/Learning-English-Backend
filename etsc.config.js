module.exports = {
  esbuild: {
    minify: false,
    target: 'es2017',
  },
  assets: {
    baseDir: 'src',
    filePatterns: [],
  },
  // Prebuild hook
  prebuild: async () => {
    console.log('prebuild')
    const rimraf = (await import('rimraf')).default
    rimraf.sync('./dist') // clean up dist folder
  },
  // Postbuild hook
  postbuild: async () => {
    console.log('postbuild')
    const cpy = (await import('cpy')).default
    await cpy(
      [
        'src/**/*.txt', // Copy all .txt files
        'src/**/*.json', // Copy all .json files
      ],
      'dist'
    )
  },
}
