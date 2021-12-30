const formatWithPrettier = prettier.format.bind(prettier);

// standalone requires parsers be explicitly loaded
prettier.format = (str, options) =>
  formatWithPrettier(
    str,
    Object.assign({}, options, {
      plugins: Object.assign({}, prettierPlugins, options.plugins)
    })
  );
