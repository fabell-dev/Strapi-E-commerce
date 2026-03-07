type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex flex-col mx-40 my-10 md:mt-30">
      <h1>Producto: {slug}</h1>
    </div>
  );
}
