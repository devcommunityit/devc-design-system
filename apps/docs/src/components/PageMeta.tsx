const SITE = 'Dev Community UI';

/** React 19 hoists <title>/<meta> into <head>. */
export function PageMeta({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{`${title} · ${SITE}`}</title>
      <meta name="description" content={description} />
    </>
  );
}