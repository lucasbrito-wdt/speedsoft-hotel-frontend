export const removerTagsHTML = (html: string) => {
  if (!html)
    return html

  return html.replace(/<[^>]*>/g, '')
}
