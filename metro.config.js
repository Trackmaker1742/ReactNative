const { getDefaultConfig } = require("@expo/metro-config");
const { mergeConfig } = require("metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  const customConfig = {
    transformer: {
      assetPlugins: ["expo-asset/tools/hashAssetFiles"],
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: defaultConfig.resolver.assetExts.filter(
        (ext) => ext !== "svg"
      ),
      sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
    },
  };

  return mergeConfig(defaultConfig, customConfig);
})();
