module.exports = {
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'Barmaglote',
            name: 'electron-helloworld'
          },
          prerelease: false,
          draft: true
        }
      }
    ]
  }