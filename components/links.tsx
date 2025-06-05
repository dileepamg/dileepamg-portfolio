export default function Links() {
  const links: { href: string }[] = [
    {
      href: "mailto:johndoe@gmail.com",
    },
    {
      href: "https://github.com/johndoe",
    },
    {
      href: "https://www.linkedin.com/in/johndoe/",
    },
    {
      href: "https://medium.com/@johndoe",
    },
  ];

  return (
    <div className="mr-auto mt-20 flex w-full flex-wrap items-center gap-10">
      {links.map((link, id) => {
        return <a target="_blank" key={id} href={link.href}></a>;
      })}
    </div>
  );
}
