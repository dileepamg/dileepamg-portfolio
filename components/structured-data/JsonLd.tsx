/**
 * Renders a structured-data block.
 *
 * The escape is the reason this exists rather than each page writing its own
 * script tag. `JSON.stringify` escapes quotes and backslashes but passes `<`
 * through untouched, so any string in the graph containing `</script>` would
 * close this element early and hand the rest of the payload to the HTML parser
 * as markup. Every value here is authored in the repo rather than submitted by
 * a reader, so this is a guard rather than a repair, but it costs one pass over
 * the string and retires the whole category.
 *
 * `<` is a valid JSON escape, so consumers still parse it back to `<`.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
