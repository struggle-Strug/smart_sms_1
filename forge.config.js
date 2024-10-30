const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    // osxSign: {
    //   "identity": "Developer ID Application: Ryota Esaki (8RNYP3A62V)",
    //   "hardenedRuntime": true,
    //   "entitlements": "entitlements.plist",
    //   "entitlementsInherit": "entitlements.plist",
    //   "gatekeeper-assess": false
    // },
    // osxNotarize: {
    //   tool: 'notarytool',
    //   appleId: "ryota0246@i.softbank.jp",
    //   appleIdPassword: "Esaki1217",
    //   teamId: "8RNYP3A62V"
    // }
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      appleId: "ryota0246@i.softbank.jp",
      appleIdPassword: "idzk-hooi-manc-drvz",
      teamId: "8RNYP3A62V",
    }
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'esakiryota',
          name: 'smart-sms'
        },
        prerelease: false,
        draft: true
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
