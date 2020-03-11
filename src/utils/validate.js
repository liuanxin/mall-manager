const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export { isExternal }
