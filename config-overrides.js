const {
  override,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra");


module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd", style: true // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { "@layout-body-background": "#FFFFFF",
    "@layout-header-background": "#FFFFFF",
    "@layout-footer-background": "#FFFFFF",
    "@primary-color": "#3E50AC",
    "@text-color": "rgba(0, 0, 0, 0.65)" }
  })
);